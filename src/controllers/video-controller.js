const Video = require('../models/Video');
const User = require('../models/User');
const redisClient = require('../config/redis');

const addVideo = async (req, res) => {
  const { title, description, url, thumbnail, userId, duration, hashtags } = req.body;

  try {
    const video = await Video.create({
      title,
      description,
      url,
      thumbnail,
      userId,
      duration,
      hashtags: hashtags || [],
    });
    res.status(201).json({ message: 'Vidéo ajoutée avec succès', video });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vidéo :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'displayName', 'profilePhoto']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const incrementViewCount = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ error: 'Vidéo non trouvée' });
    }
    
    await video.increment('viewCount', { by: 1 });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

const toggleLike = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.body;
  
  try {
    const cacheKey = `video:${videoId}:likes`;
    const isLiked = await redisClient.sismember(cacheKey, userId);
    
    if (isLiked) {
      await redisClient.srem(cacheKey, userId);
      await Video.decrement('likeCount', { where: { id: videoId }});
    } else {
      await redisClient.sadd(cacheKey, userId);
      await Video.increment('likeCount', { where: { id: videoId }});
    }
    
    res.status(200).json({ liked: !isLiked });
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

module.exports = {
  addVideo,
  getAllVideos,
  incrementViewCount,
  toggleLike
};
