export interface Game {
    id: string;
    wordSize: number;
    maxGuesses: number;
    guesses: string[];
    result: "won" | "lost" | "incomplete";
    timeTaken: number;
    isPrivate: boolean;
    player?: string;
    createdAt: string;
    completedAt?: string;
}
