const { Server } = require('socket.io');
const logger = require('./logger');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        logger.info(`New client connected: ${socket.id}`);
        socket.on('userAction', (data) => {
            logger.info('User action received:', data);
        });
        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = initializeSocket;









