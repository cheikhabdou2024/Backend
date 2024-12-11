const { body, validationResult } = require('express-validator');

// Middleware de validation pour la connexion (login)
const validateLogin = [
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware de validation pour la mise à jour d'un utilisateur
const validateUserUpdate = [
    body('firstName')
        .optional()
        .isString()
        .withMessage('First name must be a string'),
    body('lastName')
        .optional()
        .isString()
        .withMessage('Last name must be a string'),
    body('profilePhoto')
        .optional()
        .isURL()
        .withMessage('Profile photo must be a valid URL'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Exporter les deux fonctions dans un seul objet
module.exports = {
    validateLogin,
    validateUserUpdate
};


