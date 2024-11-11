import { Router } from "express";
import { getLeaderBoard } from "../controllers/leaderboard.controller.js";

const leaderboardRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard management
 */

/**
 * @swagger
 * /leaderboard/{timeFrame}/{property}:
 *   get:
 *     summary: Get leaderboard
 *     tags: [Leaderboard]
 *     parameters:
 *       - in: path
 *         name: timeFrame
 *         schema:
 *           type: string
 *           enum: [all time, this year, this month, today]
 *         required: true
 *         description: Time frame for leaderboard
 *       - in: path
 *         name: property
 *         schema:
 *           type: string
 *           enum: [totalWins, calculateWinStreak, currentRunningStreak, calculateAverageGuessCount, calculateAccuracyRate, calculatePoints]
 *         required: true
 *         description: Property for leaderboard
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: conditions
 *         schema:
 *           type: string
 *         description: Additional conditions for filtering
 *     responses:
 *       200:
 *         description: Leaderboard fetched successfully
 *       400:
 *         description: Bad request
 */
leaderboardRouter.route("/:timeFrame/:property").get(getLeaderBoard);

export default leaderboardRouter;
