const express = require('express');
const { toggleLike } = require('../controllers/like-controller');
const router = express.Router();

router.post('/', toggleLike);

module.exports = router;
