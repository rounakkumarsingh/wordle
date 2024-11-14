// src/features/game/gameSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Game } from "@/types/game.types";
import api from "@/api";

interface GameState {
    currentGame: Game | null;
    wordSize: number;
    maxGuesses: number;
    currentGuess: string[];
    guesses: string[];
    gameStatus: "playing" | "won" | "lost";
    isTimerVisible: boolean;
    timeTaken: number;
    isPrivate: boolean;
    error: string | null;
}

const initialState: GameState = {
    currentGame: null,
    wordSize: 5,
    maxGuesses: 6,
    currentGuess: [],
    guesses: [],
    gameStatus: "playing",
    isTimerVisible: true,
    timeTaken: 0,
    isPrivate: false,
    error: null,
};

export const createNewGame = createAsyncThunk(
    "game/createGame",
    async ({
        wordSize,
        maxGuesses,
    }: {
        wordSize: number;
        maxGuesses: number;
    }) => {
        const response = await api.post("/api/v1/games/createGame", {
            wordSize,
            maxGuesses,
        });
        const game = response.data.data;

        // Check if user is logged in
        const isLoggedIn = Boolean(localStorage.getItem("token"));
        if (!isLoggedIn) {
            // Store game ID in localStorage
            const gameIds = JSON.parse(localStorage.getItem("gameIds") || "[]");
            gameIds.push(game.id);
            localStorage.setItem("gameIds", JSON.stringify(gameIds));
        }

        return game;
    }
);

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        addLetter: (state, action) => {
            if (state.currentGuess.length < state.wordSize) {
                state.currentGuess.push(action.payload);
            }
        },
        removeLetter: (state) => {
            state.currentGuess.pop();
        },
        submitGuess: (state) => {
            if (state.currentGuess.length === state.wordSize) {
                state.guesses.push(state.currentGuess.join(""));
                state.currentGuess = [];
            }
        },
        toggleTimer: (state) => {
            state.isTimerVisible = !state.isTimerVisible;
        },
        updateTime: (state, action) => {
            state.timeTaken = action.payload;
        },
    },
});

export const { addLetter, removeLetter, submitGuess, toggleTimer, updateTime } =
    gameSlice.actions;
export const gameReducer = gameSlice.reducer;
