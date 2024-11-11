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

export {
    addGame,
    getGame,
    getStats,
    createGame,
    addMove,
    togglePrivate,
    getGames,
};
