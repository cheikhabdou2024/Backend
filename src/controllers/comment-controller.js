// src/controllers/comment-controller.js
const Comment = require('../models/Comment');
const User = require('../models/User');

const addComment = async (req, res) => {
    const { videoId, userId, text } = req.body;

    try {
        const comment = await Comment.create({ videoId, userId, text });
        res.status(201).json({ message: 'Comment added successfully', comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getComments = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { videoId },
            include: { model: User, as: 'user', attributes: ['id', 'displayName', 'profilePhoto'] },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addComment, getComments };
