// src/utils/gameLogic.ts
type LetterState = "correct" | "present" | "absent" | "unused";

interface GuessResult {
    letter: string;
    state: LetterState;
}

export function validateGuess(guess: string[], answer: string): GuessResult[] {
    const result = new Array(guess.length).fill({ state: "absent" });
    const answerArray = [...answer];

    // First pass: mark correct letters
    guess.forEach((letter, i) => {
        if (letter === answerArray[i]) {
            result[i] = { letter, state: "correct" };
            answerArray[i] = null;
        }
    });

    // Second pass: mark present letters
    guess.forEach((letter, i) => {
        if (!result[i].state) {
            const index = answerArray.indexOf(letter);
            if (index !== -1) {
                result[i] = { letter, state: "present" };
                answerArray[index] = null;
            } else {
                result[i] = { letter, state: "absent" };
            }
        }
    });

    return result;
}

// src/features/game/gameSlice.ts
interface GameTile {
    letter: string;
    state: LetterState;
}

interface GameState {
    wordSize: number;
    maxGuesses: number;
    currentGuess: string[];
    guesses: GameTile[][];
    keyboardState: Record<string, LetterState>;
    gameStatus: "playing" | "won" | "lost";
    answer: string;
    timeTaken: number;
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        addLetter: (state, action: PayloadAction<string>) => {
            if (state.currentGuess.length < state.wordSize) {
                state.currentGuess.push(action.payload.toLowerCase());
            }
        },
        removeLetter: (state) => {
            state.currentGuess.pop();
        },
        submitGuess: (state) => {
            if (state.currentGuess.length !== state.wordSize) return;

            const result = validateGuess(state.currentGuess, state.answer);
            state.guesses.push(result);

            // Update keyboard state
            result.forEach(({ letter, state: letterState }) => {
                const currentState = state.keyboardState[letter];
                if (
                    letterState === "correct" ||
                    (letterState === "present" && currentState !== "correct") ||
                    (!currentState && letterState === "absent")
                ) {
                    state.keyboardState[letter] = letterState;
                }
            });

            // Check win/loss
            if (state.currentGuess.join("") === state.answer) {
                state.gameStatus = "won";
            } else if (state.guesses.length >= state.maxGuesses) {
                state.gameStatus = "lost";
            }

            state.currentGuess = [];
        },
    },
});
