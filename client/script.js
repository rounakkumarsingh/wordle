toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "2000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
};

import { WORDS } from "./words.js";

let WORD_SIZE = parseInt(localStorage.getItem("WORD_SIZE")) || 5;
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
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return;
    }
    let key = target.textContent;

    if (key === "Del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

function insertLetter(pressedKey) {
    if (nextLetter === WORD_SIZE) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let row =
        document.getElementsByClassName("guess-row")[6 - guessesRemaining];
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

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
                    rightGuess[index] = null;
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
            animateCSS(box, "flipInX");
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(currentGuess[i], letterColor);
        }, delay);
    }

    if (guessString === rightGuessString) {
        toastr.success(
            `You guessed right! Game over!" + "<br><button type="button" class="try-again-btn">Try Again</button>`,
            "You Won!!!",
            {
                closeButton: true,
                tapToDismiss: false,
                timeOut: 0,
                extendedTimeOut: 0,
            }
        );
        document
            .querySelector(".try-again-btn")
            .addEventListener("click", () => {
                location.reload();
            });
        guessesRemaining = 0;
        return;
    } else {
        --guessesRemaining;
        currentGuess = [];
        nextLetter = 0;
        if (guessesRemaining === 0) {
            toastr.error(
                "You've run out of guesses! Game over!" +
                    `<br><button type="button" class="try-again-btn">Try Again</button>`,
                {
                    closeButton: true,
                    tapToDismiss: false,
                    timeOut: 0,
                    extendedTimeOut: 0,
                }
            );
            toastr.info(`The right word was: "${rightGuessString}"`, {
                closeButton: true,
                tapToDismiss: false,
                timeOut: 0,
                extendedTimeOut: 0,
            });
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === "green") {
                return;
            }

            if (oldColor === "yellow" && color !== "green") {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}

function hasMeaning(guess) {
    const size = guess.length;
    return WORDS[`size-${size}`].includes(guess);
}

const animateCSS = (element, animation, prefix = "animate__") =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element;
        node.style.setProperty("--animate-duration", "0.3s");

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, {
            once: true,
        });
    });
