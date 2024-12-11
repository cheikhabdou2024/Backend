const { Server } = require('socket.io');
const logger = require('../config/logger');

class WebRTCSignalingServer {
    constructor() {
        this.io = null;
    }

    start(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });

        this.io.on('connection', (socket) => {
            logger.info(`Client connecté : ${socket.id}`);

            // Gestion des rooms
            socket.on('join-room', (roomId, userId) => {
                socket.join(roomId);
                socket.to(roomId).emit('user-connected', userId);
            });

            // Échange de données pour WebRTC
            socket.on('offer', (data) => {
                socket.to(data.roomId).emit('offer', data);
            });

            socket.on('answer', (data) => {
                socket.to(data.roomId).emit('answer', data);
            });

            socket.on('ice-candidate', (data) => {
                socket.to(data.roomId).emit('ice-candidate', data);
            });

            // Gestion des déconnexions
            socket.on('disconnect', () => {
                logger.info(`Client déconnecté : ${socket.id}`);
            });
        });

        logger.info('Serveur de signalisation WebRTC prêt.');
    }
}

module.exports = new WebRTCSignalingServer();





