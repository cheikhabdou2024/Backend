const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors'); // Import CORS
const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const Video = require('./src/models/Video');
const authRoutes = require('./src/routes/auth-routes');
const signalingServer = require('./src/signaling/webrtc-signaling-server');
const globalErrorHandler = require('./src/middlewares/error-middleware');
const rateLimiter = require('./src/middlewares/rate-limit-middleware');
const userRoutes = require('./src/routes/user-routes');
const liveRoutes = require('./src/routes/live-routes');
const videoRoutes = require('./src/routes/video-routes'); // Import des routes vidéos
const commentRoutes = require('./src/routes/comment-routes');
const likeRoutes = require('./src/routes/like-routes');



require('dotenv').config({ path: '../../.env' });
require('./src/config/passport-setup');

const http = require('http'); // Pour créer un serveur HTTP
const { Server } = require('socket.io'); // Optionnel, pour vérifier si une autre partie nécessite Socket.IO

const app = express();
const server = http.createServer(app); // Associer Express à un serveur HTTP

// Configurer les CORS pour autoriser FlutLab.io
app.use(cors({
  origin: '*', // Autoriser tout
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Permettre l'envoi de cookies si nécessaire
}));

// Middleware pour Express
app.use(express.json()); // Permet d'analyser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour analyser les formulaires encodés

// Middleware pour les sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes d'authentification
app.use('/auth', authRoutes);

// Middleware de limitation du trafic
app.use(rateLimiter);

// Page d'accueil
app.get('/', (req, res) => {
    res.send(`
    <h1>Authentification Google OAuth</h1>
    <a href="/auth/google">Se connecter avec Google</a>
  `);
});

// Middleware pour vérifier si l'utilisateur est authentifié
const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
};

// Tableau de bord (accessible uniquement aux utilisateurs connectés)
app.get('/dashboard', checkAuthentication, (req, res) => {
    res.json({
        message: 'Tableau de bord',
        user: {
            id: req.user.id,
            email: req.user.email,
            displayName: req.user.displayName
        }
    });
});

// Routes utilisateur
app.use('/users', userRoutes);

// Routes vidéo
app.use('/videos', videoRoutes);

app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);



// Initialisation du serveur WebRTC
signalingServer.start(server);

// Gestion globale des erreurs
app.use(globalErrorHandler);

// Ajouter les routes de gestion des lives
app.use('/live', liveRoutes);

// Fonction d'initialisation
const initializeServer = async () => {
    try {
        // Tester la connexion à PostgreSQL
        await sequelize.authenticate();
        console.log('Connexion à PostgreSQL établie.');

        // Synchroniser les modèles avec la base de données
        await sequelize.sync({ alter: true });
        console.log('Modèles synchronisés avec la base de données.');

        // Démarrer le serveur
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Serveur principal démarré sur le port ${PORT}`);
            console.log(`Accédez à http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erreur de démarrage :', error);
    }
};

initializeServer();
