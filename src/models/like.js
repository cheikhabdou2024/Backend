const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Video = require('./Video');
const User = require('./User');

const Like = sequelize.define('Like', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Video,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

Video.hasMany(Like, { foreignKey: 'videoId', as: 'likes' });
Like.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

User.hasMany(Like, { foreignKey: 'userId', as: 'userLikes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Like;

