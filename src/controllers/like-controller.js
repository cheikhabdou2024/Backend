const Like = require('../models/Like');

const toggleLike = async (req, res) => {
    const { videoId, userId } = req.body;

    try {
        const existingLike = await Like.findOne({ where: { videoId, userId } });

        if (existingLike) {
            await existingLike.destroy();
            return res.status(200).json({ message: 'Like removed' });
        }

        const like = await Like.create({ videoId, userId });
        res.status(201).json({ message: 'Like added', like });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { toggleLike };
