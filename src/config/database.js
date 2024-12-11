require('dotenv').config(); // Charge les variables d'environnement
const { Sequelize } = require('sequelize');

// Créer une instance Sequelize avec la configuration
const sequelize = new Sequelize(
    process.env.DB_NAME,    // Nom de la base de données
    process.env.DB_USER,    // Nom d'utilisateur
    process.env.DB_PASSWORD, // Mot de passe
    {
        host: process.env.DB_HOST, // Hôte (localhost ou IP du serveur)
        port: process.env.DB_PORT || 5432, // Port (par défaut : 5432)
        dialect: 'postgres',       // Utilisation de PostgreSQL
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        },
        logging: false,            // Désactiver les logs SQL (ou console.log pour voir les requêtes)
    }
);

// Tester la connexion
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion réussie à PostgreSQL avec Sequelize.');
    } catch (error) {
        console.error('Erreur lors de la connexion à PostgreSQL:', error);
    }
})();

module.exports = sequelize; // Exporter l'instance Sequelize



