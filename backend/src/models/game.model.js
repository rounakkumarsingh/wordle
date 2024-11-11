import { model, Schema } from "mongoose";

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
