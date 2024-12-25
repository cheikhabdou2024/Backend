const express = require('express');
const { addVideo, getAllVideos, getVideoById } = require('../controllers/video-controller');
const router = express.Router();

// Ajouter une vidéo
router.post('/', addVideo);

// Récupérer toutes les vidéos
router.get('/', getAllVideos);

// Récupérer une vidéo spécifique par ID
router.get('/:id', getVideoById);

module.exports = router;
