import { Router } from "express";
import { verifyJWT, checkJWT } from "../middlewares/auth.middleware.js";
import {
    addGame,
    createGame,
    getGame,
    getStats,
    togglePrivate,
    getGames,
    addMove,
    updateTimeTaken,
} from "../controllers/game.controller.js";

const gameRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management and retrieval
 */

/**
 * @swagger
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
 *                 description: The answer for the game
 *               maxGuesses:
 *                 type: integer
 *                 description: The maximum number of guesses allowed
 *     responses:
 *       201:
 *         description: Game created successfully
 *       400:
 *         description: No answer key found
 */
gameRouter.route("/createGame").post(checkJWT, createGame);

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
 *                   type: string
 *                 description: Array of game IDs to add
 *     responses:
 *       201:
 *         description: Games added successfully
 *       400:
 *         description: Bad request
 */
gameRouter.route("/addGame").post(verifyJWT, addGame);

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
 *                 description: The new move to add to the game
 *     responses:
 *       201:
 *         description: Move added successfully
 *       400:
 *         description: newMove required
 *       403:
 *         description: Unauthorized to update this game
 */
gameRouter.route("/:gameId/addMove").patch(checkJWT, addMove);

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
gameRouter.route("/:gameId/togglePrivate").patch(verifyJWT, togglePrivate);

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
gameRouter.route("/getGame/:gameId").get(checkJWT, getGame);

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
gameRouter.route("/getStats/:username").get(getStats);

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
gameRouter.route("/getGames/:username").get(checkJWT, getGames);

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
gameRouter.route("/:gameId/updateTimeTaken").patch(checkJWT, updateTimeTaken);

export default gameRouter;
