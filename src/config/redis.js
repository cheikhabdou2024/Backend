const redis = require('redis');

// Créer le client Redis avec les paramètres d'environnement
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost', // Hôte par défaut : localhost
    port: process.env.REDIS_PORT || 6379,       // Port par défaut : 6379
    password: process.env.REDIS_PASSWORD || null // Ajoutez un mot de passe si nécessaire
});

// Événements pour surveiller la connexion Redis
redisClient.on('connect', () => console.log('Redis connecté avec succès.'));
redisClient.on('error', (err) => console.error('Erreur Redis :', err));

// Exporter le client Redis pour une utilisation dans d'autres fichiers
module.exports = redisClient;




