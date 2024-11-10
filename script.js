import { WORDS } from "./words.js";

let WORD_SIZE = 5;
let NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);

function setBoard() {
    const board = document.getElementById("board");

    for (let i = 0; i < NUMBER_OF_GUESSES; ++i) {
        let row = document.createElement("div");
        row.className = "guess-row";

        for (let j = 0; j < WORD_SIZE; j++) {
            let box = document.createElement("div");
            box.className = "guess-box";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    setBoard();
});
