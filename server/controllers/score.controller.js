const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Score = require("../models/Score");

// @desc    Save or update user's high score for a game
// @route   POST /api/scores
// @access  Private
const saveScore = asyncHandler(async (req, res) => {
    const { game, score } = req.body;

    if (!game || score === undefined) {
        throw new ApiError(400, "Game name and score are required");
    }

    // Try to find an existing score for this user and game
    const existingScore = await Score.findOne({ userId: req.user._id, game });

    if (existingScore) {
        // If the new score is higher, update it
        if (score > existingScore.score) {
            existingScore.score = score;
            existingScore.date = Date.now();
            await existingScore.save();
            return res.status(200).json(
                new ApiResponse(200, existingScore, "New high score saved successfully")
            );
        } else {
            // If not higher, just return success without updating
            return res.status(200).json(
                new ApiResponse(200, existingScore, "Score submitted (not a new high score)")
            );
        }
    } else {
        // Create new score if none exists
        const newScore = await Score.create({
            userId: req.user._id,
            game,
            score
        });

        return res.status(201).json(
            new ApiResponse(201, newScore, "First score saved successfully")
        );
    }
});

// @desc    Get top 10 high scores for a specific game
// @route   GET /api/scores/:game
// @access  Private
const getGameHighScores = asyncHandler(async (req, res) => {
    const { game } = req.params;

    if (!game) {
        throw new ApiError(400, "Game parameter is required");
    }

    const scores = await Score.find({ game })
        .sort({ score: -1 })
        .limit(10)
        .populate("userId", "username email");

    return res.status(200).json(
        new ApiResponse(200, scores, "Game high scores retrieved successfully")
    );
});

// @desc    Get all high scores for the logged-in user
// @route   GET /api/scores/user/scores
// @access  Private
const getUserScores = asyncHandler(async (req, res) => {
    const scores = await Score.find({ userId: req.user._id })
        .sort({ date: -1 });

    return res.status(200).json(
        new ApiResponse(200, scores, "User scores retrieved successfully")
    );
});

module.exports = {
    saveScore,
    getGameHighScores,
    getUserScores
};
