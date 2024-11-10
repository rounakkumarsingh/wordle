toastr.options.closeButton = true;
import { WORDS } from "./words.js";

let WORD_SIZE = parseInt(localStorage.getItem("WORD_SIZE")) || 5;
console.log(WORD_SIZE);

let NUMBER_OF_GUESSES =
    parseInt(localStorage.getItem("NUMBER_OF_GUESSES")) || 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString =
    WORDS[`size-${WORD_SIZE}`][
        Math.floor(Math.random() * WORDS[`size-${WORD_SIZE}`].length)
    ];
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

document.addEventListener("keyup", (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found =
        pressedKey.length === 1 &&
        ((pressedKey >= "a" && pressedKey <= "z") ||
            (pressedKey >= "A" && pressedKey <= "Z"));
    if (!found) {
        return;
    } else {
        insertLetter(pressedKey);
    }

    function insertLetter(pressedKey) {
        if (nextLetter === WORD_SIZE) {
            return;
        }
        pressedKey = pressedKey.toLowerCase();

        let row =
            document.getElementsByClassName("guess-row")[6 - guessesRemaining];
        let box = row.children[nextLetter];
        box.textContent = pressedKey;
        box.classList.add("filled-box");
        currentGuess.push(pressedKey);
        nextLetter += 1;
    }
});

function deleteLetter() {
    let row =
        document.getElementsByClassName("guess-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess() {
    let row =
        document.getElementsByClassName("guess-row")[
            NUMBER_OF_GUESSES - guessesRemaining
        ];
    let guessString = currentGuess.join("");
    let rightGuess = Array.from(rightGuessString);
    if (guessString.length != WORD_SIZE) {
        toastr.error(
            `Not enough letters! Enter ${
                WORD_SIZE - guessString.length
            } more letters`
        );
    }

    if (!hasMeaning(guessString)) {
        toastr.error("Not in my word list");
        return;
    }

    const status = new Array(WORD_SIZE).fill(0);

    for (let i = 0; i < WORD_SIZE; i++) {
        if (currentGuess[i] === rightGuess[i]) {
            status[i] = 2;
            rightGuess[i] = null;
        }
    }
    for (let i = 0; i < WORD_SIZE; i++) {
        if (!status[i]) {
            if (rightGuess.includes(currentGuess[i])) {
                let index = rightGuess.indexOf(currentGuess[i]);
                if (status[index] === 0) {
                    status[i] = 1;
                    rightGuess[index] = null; // Mark this letter as used
                } else {
                    alert("Something is wrong!!! 487");
                }
            }
        }
    }

    for (let i = 0; i < WORD_SIZE; ++i) {
        let letterColor =
            status[i] === 2 ? "green" : status[i] === 1 ? "yellow" : "grey";
        let box = row.children[i];
        let delay = 250 * i;
        setTimeout(() => {
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!");
        guessesRemaining = 0;
        return;
    } else {
        --guessesRemaining;
        currentGuess = [];
        nextLetter = 0;
        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!");
            toastr.info(`The right word was: "${rightGuessString}"`);
        }
    }
}

function hasMeaning(guess) {
    const size = guess.length;
    return WORDS[`size-${size}`].includes(guess);
}
