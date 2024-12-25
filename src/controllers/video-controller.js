const Video = require('../models/Video');

const addVideo = async (req, res) => {
  const { title, description, url, thumbnail, userId } = req.body;

  try {
    const video = await Video.create({ title, description, url, thumbnail, userId });
    res.status(201).json({ message: 'Vidéo ajoutée avec succès', video });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vidéo :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: ['user'], // Inclure les données utilisateur associées
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByPk(id, { include: ['user'] });
    if (!video) {
      return res.status(404).json({ error: 'Vidéo non trouvée' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = { addVideo, getAllVideos, getVideoById };
