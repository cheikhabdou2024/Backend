// src/routes/comment-routes.js
const express = require('express');
const { addComment, getComments } = require('../controllers/comment-controller');
const router = express.Router();

router.post('/', addComment);
router.get('/:videoId', getComments);

module.exports = router;
