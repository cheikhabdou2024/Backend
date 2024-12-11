const express = require('express');
const router = express.Router();

let activeLives = []; // Liste des lives actifs

// Hôte démarre un live
router.post('/start', (req, res) => {
    const { hostId, liveTitle } = req.body;
    const liveSession = {
        hostId,
        liveTitle,
        roomId: `room-${Date.now()}`,
    };
    activeLives.push(liveSession);
    res.json(liveSession);
});

// Utilisateur récupère les lives actifs
router.get('/list', (req, res) => {
    res.json(activeLives);
});

// Supprimer un live quand il se termine
router.post('/end', (req, res) => {
    const { roomId } = req.body;
    activeLives = activeLives.filter((live) => live.roomId !== roomId);
    res.json({ message: 'Live ended' });
});

module.exports = router;


