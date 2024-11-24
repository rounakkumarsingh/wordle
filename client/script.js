async function getWordsByFrequency(length, freqLevel) {
    const limit = 1;
    try {
        if (length < 1 || freqLevel < 1 || freqLevel > 10) {
            throw new Error(
                "Invalid parameters: length must be positive, freqLevel must be 1-10"
            );
        }

        const pattern = "?".repeat(length);
        const response = await fetch(
            `https://api.datamuse.com/words?sp=${pattern}&md=f&max=1000`
        );
        const words = await response.json();

        const wordsWithFreq = words
            .filter(
                (word) =>
                    /^[a-zA-Z]+$/.test(word.word) && word.word.length === length
            )
            .map((word) => ({
                word: word.word.toLowerCase(),
                frequency: parseFloat(
                    word.tags?.find((tag) => tag.startsWith("f:"))?.slice(2) ||
                        0
                ),
            }))
            .filter((word) => word.frequency > 0);

        wordsWithFreq.sort((a, b) => b.frequency - a.frequency);

        const bandSize = Math.floor(wordsWithFreq.length / 10);
        const startIndex = (freqLevel - 1) * bandSize;
        const endIndex = startIndex + bandSize;

        const frequencyBand = wordsWithFreq.slice(startIndex, endIndex);

        const randomWords = [];
        const tempBand = [...frequencyBand];
        while (randomWords.length < limit && tempBand.length > 0) {
            const randomIndex = Math.floor(Math.random() * tempBand.length);
            randomWords.push(tempBand[randomIndex]);
            tempBand.splice(randomIndex, 1);
        }

        return randomWords[0].word;
    } catch (error) {
        console.error("Error fetching words:", error);
        return "";
    }
}

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

let WORD_SIZE = parseInt(localStorage.getItem("WORD_SIZE")) || 5;
if (!localStorage.getItem("WORD_SIZE")) {
    localStorage.setItem("WORD_SIZE", 5);
}
let NUMBER_OF_GUESSES =
    parseInt(localStorage.getItem("NUMBER_OF_GUESSES")) || 6;
if (!localStorage.getItem("NUMBER_OF_GUESSES")) {
    localStorage.setItem("NUMBER_OF_GUESSES", 6);
}
let level = parseInt(localStorage.getItem("difficultyLevel")) || 1;
if (!localStorage.getItem("difficultyLevel")) {
    localStorage.setItem("difficultyLevel", 1);
}
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = "";
setTimeout(async () => {
    rightGuessString = await getWordsByFrequency(WORD_SIZE, level);
}, 0);

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
setBoard();

document.addEventListener("keyup", async (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        await checkGuess();
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

async function checkGuess() {
    let row =
        document.getElementsByClassName("guess-row")[
            NUMBER_OF_GUESSES - guessesRemaining
        ];
    let guessString = currentGuess.join("");
    const isValid = await hasMeaning(guessString);
    let rightGuess = Array.from(rightGuessString);
    if (guessString.length != WORD_SIZE) {
        toastr.error(
            `Not enough letters! Enter ${
                WORD_SIZE - guessString.length
            } more letters`
        );
        return;
    }

    if (!isValid) {
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
                if (index >= 0 && index < WORD_SIZE && status[i] === 0) {
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
        setTimeout(
            ((i, letter) => () => {
                animateCSS(box, "flipInX");
                box.style.backgroundColor = letterColor;
                shadeKeyBoard(letter, letterColor);
            })(i, currentGuess[i]),
            delay
        );
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

async function hasMeaning(word) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            URL.createObjectURL(
                new Blob(
                    [
                        `
            onmessage = async function(e) {
                const word = e.data;
                try {
                    const response = await fetch(\`https://api.datamuse.com/words?sp=\${word}&max=1\`);
                    const data = await response.json();
                    const isValid = data.length > 0 && data[0].word.toLowerCase() === word;
                    postMessage(isValid);
                } catch (error) {
                    postMessage(false);
                }
            }
        `,
                    ],
                    { type: "application/javascript" }
                )
            )
        );

        worker.onmessage = function (e) {
            resolve(e.data);
            worker.terminate();
        };

        worker.onerror = function (error) {
            reject(error);
            worker.terminate();
        };

        worker.postMessage(word);
    });
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
