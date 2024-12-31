const express = require('express');
const { getUser, updateUser } = require('../controllers/user-controller'); // Importer les fonctions du contrôleur
const { validateUserUpdate } = require('../utils/validator'); // Middleware de validation
const router = express.Router();

// Route pour obtenir un utilisateur par ID
router.get('/:id', getUser);

// Route pour mettre à jour un utilisateur par ID
router.put('/:id', validateUserUpdate, updateUser);


// New route for detailed user profile
router.get('/details/:id', getUserWithDetails);

module.exports = router;



