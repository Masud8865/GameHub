const express = require('express');
const { saveScore, getGameHighScores, getUserScores } = require('../controllers/score.controller');
const verifyJWT = require('../middlewares/auth.middleware');

const router = express.Router();

// Route to attach score for authenticated user
router.post('/', verifyJWT, saveScore);

// Route to get all scores for the authenticated user
router.get('/user/scores', verifyJWT, getUserScores);

// Route to get high scores for a specific game
router.get('/:game', verifyJWT, getGameHighScores);

module.exports = router;