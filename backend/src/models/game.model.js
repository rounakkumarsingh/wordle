import { model, Schema } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - answer
 *         - maxGuesses
 *         - guesses
 *         - player
 *         - result
 *         - privateGame
 *         - startTime
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the game
 *         answer:
 *           type: string
 *         maxGuesses:
 *           type: integer
 *         guesses:
 *           type: array
 *           items:
 *             type: string
 *         player:
 *           type: string
 *           description: User ID of the player
 *         result:
 *           type: string
 *           enum: [lost, won, incomplete]
 *         privateGame:
 *           type: boolean
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         timeTaken:
 *           type: integer
 *       example:
 *         id: d5fE_asz
 *         answer: "apple"
 *         maxGuesses: 5
 *         guesses: ["apple", "grape"]
 *         player: "userId"
 *         result: "won"
 *         privateGame: false
 *         startTime: "2023-10-01T00:00:00.000Z"
 *         endTime: "2023-10-01T00:05:00.000Z"
 *         timeTaken: 300
 */
const gameSchema = Schema(
    {
        answer: {
            type: String,
            required: true,
        },
        maxGuesses: {
            type: Number,
            required: true,
            default: 5,
        },
        guesses: [
            {
                type: String,
                required: true,
            },
        ],
        player: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        result: {
            type: String,
            enum: ["lost", "won", "incomplete"],
            default: false,
            required: false,
        },
        privateGame: {
            type: Boolean,
            default: false,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
            default: null,
        },
        endTime: { type: Date },
        timeTaken: {
            type: Number,
            default: 0,
        },
    },
    { timeStamps: true }
);

const Game = model("Game", gameSchema);

export default Game;
