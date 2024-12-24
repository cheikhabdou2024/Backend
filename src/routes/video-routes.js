const express = require('express');
const { 
  addVideo, 
  getAllVideos, 
  incrementViewCount, 
  toggleLike 
} = require('../controllers/video-controller');
const router = express.Router();

// Existing routes
router.post('/', addVideo);
router.get('/', getAllVideos);

// New routes
router.post('/:id/view', incrementViewCount);
router.post('/:videoId/like', toggleLike);

module.exports = router;
