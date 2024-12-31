// src/models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Video = require('./Video');
const User = require('./User');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
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

Video.hasMany(Comment, { foreignKey: 'videoId', as: 'comments' });
Comment.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'userComments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Comment;
