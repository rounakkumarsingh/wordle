import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    totalWins,
    calculateWinStreak,
    currentRunningStreak,
    calculateAverageGuessCount,
    calculateAccuracyRate,
    calculatePoints,
} from "../utils/statsCalculator.js";

const statsFunctions = {
    totalWins,
    calculateWinStreak,
    currentRunningStreak,
    calculateAverageGuessCount,
    calculateAccuracyRate,
    calculatePoints,
};

export const getLeaderBoard = asyncHandler(async (req, res) => {
    const { timeFrame, property } = req.params;
    const { page = 1, conditions = "{}" } = req.query;

    if (
        !["all time", "this year", "this month", "today"].includes(timeFrame) ||
        !Object.keys(statsFunctions).includes(property)
    ) {
        throw new ApiError(
            `timeFrame should be in ["all time", "this year", "this month", "today"] && property should be in ${Object.keys(statsFunctions)}`
        );
    }

    let matchStage = {};

    const now = new Date();
    switch (timeFrame) {
        case "today":
            matchStage = {
                "games.startTime": {
                    $gte: new Date(now.setHours(0, 0, 0, 0)),
                    $lt: new Date(now.setHours(23, 59, 59, 999)),
                },
            };
            break;
        case "this month":
            matchStage = {
                "games.startTime": {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 0),
                },
            };
            break;
        case "this year":
            matchStage = {
                "games.startTime": {
                    $gte: new Date(now.getFullYear(), 0, 1),
                    $lt: new Date(now.getFullYear(), 12, 31),
                },
            };
            break;
        case "all time":
        default:
            matchStage = {};
            break;
    }

    const parsedConditions = JSON.parse(conditions);

    const aggregate = User.aggregate([
        { $match: parsedConditions },
        {
            $lookup: {
                from: "games",
                localField: "games",
                foreignField: "_id",
                as: "games",
            },
        },
        { $unwind: "$games" },
        { $match: matchStage },
        {
            $group: {
                _id: "$_id",
                username: { $first: "$username" },
                email: { $first: "$email" },
                fullName: { $first: "$fullName" },
                profilePicture: { $first: "$profilePicture" },
                games: { $push: "$games" },
            },
        },
        {
            $addFields: {
                [property]: {
                    $function: {
                        body: statsFunctions[property].toString(),
                        args: ["$games"],
                        lang: "js",
                    },
                },
            },
        },
        { $sort: { [property]: -1 } },
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: 10,
    };

    const result = await User.aggregatePaginate(aggregate, options);

    return res.status(200).json(new ApiResponse(200, result));
});