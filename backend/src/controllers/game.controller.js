import Game from "../models/game.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    calculateAccuracyRate,
    calculateAverageGuessCount,
    calculatePoints,
    calculateWinStreak,
    currentRunningStreak,
    totalWins,
} from "../utils/statsCalculator.js";
/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management and retrieval
 */

/**
 * /games/createGame:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *               maxGuesses:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Game created successfully
 *       400:
 *         description: No answer key found
 */

const createGame = asyncHandler(async (req, res) => {
    const { answer, maxGuesses } = req.body;
    if (!answer || !maxGuesses) {
        throw new ApiError(400, "No answer key found");
    }
    const game = await Game.create({
        player: req.user ? req.user?._id : null,
        answer,
        maxGuesses: parseInt(maxGuesses),
        guesses: [],
        result: "incomplete",
        privateGame: false,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, "User Created Successfully", game));
});

/**
 * @swagger
 * /games/addGame:
 *   post:
 *     summary: Add games to user
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newGames:
 *                 type: array
 *                 items:
 *                   type: string(ObjectId)
 *     responses:
 *       201:
 *         description: Games added successfully
 *       400:
 *         description: Bad request
 */
const addGame = asyncHandler(async (req, res) => {
    const { newGames } = req.body;
    if (!newGames || !Array.isArray(newGames)) {
        throw new ApiError("Expected Req Body: {newGames: [game ObjectId]");
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { games: { $each: newGames } },
    });

    return res
        .status(201)
        .json(new ApiResponse(201, "Games added successfully", user));
});

/**
 * @swagger
 * /games/{gameId}/addMove:
 *   patch:
 *     summary: Add move to a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: string
 *         required: true
 *         description: Game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newMove:
 *                 type: string
 *     responses:
 *       201:
 *         description: Move added successfully
 *       400:
 *         description: newMove required
 *       403:
 *         description: Unauthorized to update this game
 */
const addMove = asyncHandler(async (req, res) => {
    const { newMove } = req.body;
    if (!newMove) {
        throw new ApiError(400, "newMove required");
    }
    const { gameId } = req.params;
    const game = await Game.findOneAndUpdate(
        { _id: gameId, $or: [{ player: null }, { player: req.user._id }] },
        { $push: { guesses: newMove } },
        { new: true }
    );

    if (!game) {
        throw new ApiError(403, "You are not authorized to update this game");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Move Added successfully", game));
});

/**
 * @swagger
 * /games/{gameId}/togglePrivate:
 *   patch:
 *     summary: Toggle game privacy
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: string
 *         required: true
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Game privacy toggled successfully
 *       400:
 *         description: GameId required
 *       404:
 *         description: Game not found or unauthorized
 */
const togglePrivate = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    if (!gameId) {
        throw new ApiError(400, "GameId required");
    }
    const game = await Game.findOneAndUpdate(
        {
            _id: gameId,
            player: req.user?._id,
        },
        {
            $set: { privateGame: !game.privateGame },
        },
        { new: true }
    );

    if (!game) {
        throw new ApiError(
            404,
            "Game not found or you are not authorized to update this game"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Game privacy toggled successfully", game));
});

/**
 * @swagger
 * /games/getGame/{gameId}:
 *   get:
 *     summary: Get game by ID
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: string
 *         required: true
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Game fetched successfully
 *       400:
 *         description: game id is required
 *       404:
 *         description: Game not found or unauthorized
 */
const getGame = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    if (!gameId) {
        throw new ApiError(400, "game id is required");
    }

    const game = await Game.findOne({
        _id: gameId,
        $or: [
            { privateGame: false },
            { privateGame: true, player: req.user?._id },
        ],
    })
        .populate("player", "username")
        .lean();

    if (!game) {
        throw new ApiError(
            404,
            "Game not found or you are not authorized to view this game"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Game fetched successfully", game));
});

/**
 * @swagger
 * /games/getStats/{username}:
 *   get:
 *     summary: Get user stats by username
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username
 *     responses:
 *       200:
 *         description: User stats fetched successfully
 *       400:
 *         description: username is required
 *       404:
 *         description: User not found
 */
const getStats = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "username is required");
    }

    const user = await User.findOne({ username })
        .populate({
            path: "games",
            match: user.statsUsingPrivate ? {} : { privateGame: false },
        })
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const stats = {
        totalWins: totalWins(user.games),
        maxWinStreak: calculateWinStreak(user.games),
        average: calculateAverageGuessCount(user.games),
        accuracy: calculateAccuracyRate(user.games),
        points: calculatePoints(user.games),
        runningStreak: currentRunningStreak(user.games),
    };
    return res
        .status(200)
        .json(new ApiResponse(200, "User stats fetched successfully", stats));
});

/**
 * @swagger
 * /games/getGames/{username}:
 *   get:
 *     summary: Get games by username
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username
 *     responses:
 *       200:
 *         description: Games fetched successfully
 *       400:
 *         description: username is required
 *       404:
 *         description: User not found
 */
const getGames = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "username is required");
    }

    const user = await User.findOne({ username })
        .populate({
            path: "games",
            match: {
                $or: [
                    { privateGame: false },
                    { privateGame: true, player: req.user?._id },
                ],
            },
            populate: { path: "player", select: "username" },
        })
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const games = user.games;

    return res
        .status(200)
        .json(new ApiResponse(200, "Games fetched successfully", games));
});

/**
 * @swagger
 * /games/{gameId}/updateTimeTaken:
 *   patch:
 *     summary: Update time taken for a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: string
 *         required: true
 *         description: Game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latestTimeTaken:
 *                 type: number
 *                 description: The latest time taken to update
 *     responses:
 *       200:
 *         description: Time taken updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Unauthorized to update this game
 *       404:
 *         description: Game not found
 */
const updateTimeTaken = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const { latestTimeTaken: time } = req.body;
    const latestTimeTaken = parseInt(time, 10);

    if (!latestTimeTaken || typeof latestTimeTaken !== "number") {
        throw new ApiError(
            400,
            "latestTimeTaken is required and must be a number"
        );
    }

    const game = await Game.findById(gameId);

    if (!game) {
        throw new ApiError(404, "Game not found");
    }

    if (game.player && game.player.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to update this game");
    }

    if (game.result === "incomplete" && latestTimeTaken >= game.timeTaken) {
        game.timeTaken = latestTimeTaken;
        await game.save();
    }

    return res
        .status(200)
        .json(new ApiResponse(200, game, "Time taken updated successfully"));
});

export {
    addGame,
    getGame,
    getStats,
    createGame,
    addMove,
    togglePrivate,
    getGames,
    updateTimeTaken,
};
