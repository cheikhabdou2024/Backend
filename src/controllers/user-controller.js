const User = require('../models/User'); // Modèle Sequelize
const Video = require('../models/Video'); // Import the Video model
const Like = require('../models/Like'); // Import the Like model
const redisClient = require('../config/redis'); // Import de Redis

// Fonction pour obtenir les détails d'un utilisateur avec Redis et détails enrichis
const getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Vérifier si l'utilisateur est déjà dans le cache Redis
        redisClient.get(userId, async (err, cachedUser) => {
            if (err) {
                console.error('Erreur Redis :', err);
                return res.status(500).json({ error: 'Erreur interne du serveur' });
            }

            if (cachedUser) {
                // Retourner l'utilisateur depuis Redis
                console.log(`Utilisateur trouvé dans le cache Redis : ${userId}`);
                return res.json(JSON.parse(cachedUser));
            }

            // Si l'utilisateur n'est pas dans le cache, récupérer depuis PostgreSQL
            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Video,
                        as: 'videos',
                        attributes: ['id', 'title', 'description', 'url', 'createdAt'],
                    },
                    {
                        model: Like,
                        as: 'userLikes',
                        include: {
                            model: Video,
                            as: 'video',
                            attributes: ['id', 'title', 'url'],
                        },
                    },
                ],
                attributes: ['id', 'displayName', 'profilePhoto', 'email'],
            });

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Stocker l'utilisateur enrichi dans Redis pour une durée de 1 heure
            redisClient.setex(userId, 3600, JSON.stringify(user), (err) => {
                if (err) {
                    console.error(`Erreur lors de la mise en cache de l'utilisateur ${userId} :`, err);
                } else {
                    console.log(`Utilisateur enrichi ${userId} mis en cache avec succès.`);
                }
            });

            // Retourner l'utilisateur enrichi
            res.json(user);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Fonction pour mettre à jour les informations utilisateur
const updateUser = async (req, res) => {
    const userId = req.params.id; // Récupérer l'ID utilisateur depuis l'URL
    const { firstName, lastName, profilePhoto } = req.body; // Données envoyées par le frontend

    try {
        // Vérifier si l'utilisateur existe dans la base de données
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Mettre à jour l'utilisateur
        await user.update({
            firstName: firstName || user.firstName, // Garder la valeur actuelle si rien n'est envoyé
            lastName: lastName || user.lastName,
            profilePhoto: profilePhoto || user.profilePhoto,
        });

        // Mettre à jour le cache Redis avec les nouvelles informations
        redisClient.setex(userId, 3600, JSON.stringify(user), (err) => {
            if (err) {
                console.error(`Erreur lors de la mise à jour du cache pour l'utilisateur ${userId} :`, err);
            } else {
                console.log(`Cache Redis mis à jour pour l'utilisateur ${userId}.`);
            }
        });

        res.json({ message: 'Utilisateur mis à jour avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Exporter les fonctions
module.exports = { getUser, updateUser };
