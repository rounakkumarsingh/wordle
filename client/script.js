async function getWordsByFrequency(length, freqLevel) {
    const limit = 100;
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
let nextLetter = 1;
let rightGuessString = "";
setTimeout(async () => {
    rightGuessString = await getWordsByFrequency(WORD_SIZE, level);
}, 0);
let isChecking = false;

function setBoard() {
    const board = document.getElementById("board");
    const toasts = document.getElementById("toast-container");
    if (toasts) toasts.innerHTML = "";
    for (let i = 0; i < NUMBER_OF_GUESSES; ++i) {
        let row = document.createElement("div");
        row.className = "guess-row";

        let dummyLoader = document.createElement("div");
        dummyLoader.className = "spinner-grow text-light";
        dummyLoader.setAttribute("role", "status");

        let dmy = document.createElement("span");
        dmy.className = "sr-only";
        dummyLoader.appendChild(dmy);

        dummyLoader.style.setProperty("visibility", "hidden", "important");
        row.appendChild(dummyLoader);

        for (let j = 0; j < WORD_SIZE; j++) {
            let box = document.createElement("div");
            box.className = "guess-box";
            if (j === WORD_SIZE - 1) {
                box.style.marginRight = "20px";
            } else if (j === 0) {
                box.style.marginLeft = "20px";
            }
            row.appendChild(box);
        }
        let loader = document.createElement("div");
        loader.className = "spinner-grow text-light";
        loader.setAttribute("role", "status");

        let spinnerText = document.createElement("span");
        spinnerText.className = "sr-only";
        loader.appendChild(spinnerText);

        loader.style.visibility = "hidden";

        row.appendChild(loader);
        board.appendChild(row);
    }
}

function loadSettings() {
    const wordSizeOptions = document.querySelectorAll("#wordSize > option");
    const currentWordSize = parseInt(localStorage.getItem("WORD_SIZE"));
    if (currentWordSize) {
        wordSizeOptions.forEach((element) => {
            if (element.value == currentWordSize) {
                element.setAttribute("selected", "selected");
            } else {
                element.removeAttribute("selected");
            }
        });
    }
    const guessCountOptions = document.querySelectorAll("#guessCount > option");
    const currentGuessOption = parseInt(
        localStorage.getItem("NUMBER_OF_GUESSES")
    );
    if (currentGuessOption) {
        guessCountOptions.forEach((element) => {
            if (element.value == currentGuessOption) {
                element.setAttribute("selected", "selected");
            } else {
                element.removeAttribute("selected");
            }
        });
    }

    const levelOptions = document.querySelectorAll("#level > option");
    const currentLevel = parseInt(localStorage.getItem("difficultyLevel"));
    if (currentLevel) {
        levelOptions.forEach((element) => {
            if (element.value == currentLevel) {
                element.setAttribute("selected", "selected");
            } else {
                element.removeAttribute("selected");
            }
        });
    }
}

setBoard();
loadSettings();

document.addEventListener("keyup", async (e) => {
    if (isChecking) return;

    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter > 1) {
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
    if (nextLetter === WORD_SIZE + 1) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let row =
        document.getElementsByClassName("guess-row")[
            NUMBER_OF_GUESSES - guessesRemaining
        ];
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function deleteLetter() {
    let row =
        document.getElementsByClassName("guess-row")[
            NUMBER_OF_GUESSES - guessesRemaining
        ];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

async function checkGuess() {
    if (isChecking) return;
    isChecking = true;
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
        isChecking = false;
        return;
    }

    if (!isValid) {
        toastr.error("Not in my word list");
        isChecking = false;
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

    for (let i = 1; i <= WORD_SIZE; ++i) {
        let letterColor =
            status[i] === 2
                ? "#4CAF50"
                : status[i] === 1
                ? "rgb(181, 159, 59)"
                : "#333333";
        let box = row.children[i];
        let delay = 250 * i;
        setTimeout(
            ((i, letter) => () => {
                animateCSS(box, "flipInX");
                box.style.backgroundColor = letterColor;
                box.style.borderColor = "transparent";
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
            .addEventListener("click", restartGame);
        guessesRemaining = 0;
        isChecking = false;
        return;
    } else {
        --guessesRemaining;
        currentGuess = [];
        nextLetter = 1;
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
            document
                .querySelector(".try-again-btn")
                .addEventListener("click", restartGame);
        }
        isChecking = false;
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === "green") {
                return;
            }

            if (oldColor === "#cfcf00" && color !== "green") {
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

const animateCSS = (element, animation, prefix = "animate__") => {
    // We create a Promise and return it
    return new Promise((resolve, reject) => {
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
};

const settingsBtn = document.getElementById("settings-btn");
const modal = document.getElementById("settings-modal");
const applyBtn = document.getElementById("apply-btn");
const resetBtn = document.getElementById("reset-btn");

settingsBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

applyBtn.addEventListener("click", () => {
    const wordSize = document.getElementById("wordSize").value;
    const guessCount = document.getElementById("guessCount").value;
    const difficultyLevel = document.getElementById("level").value;

    localStorage.setItem("WORD_SIZE", wordSize);
    localStorage.setItem("NUMBER_OF_GUESSES", guessCount);
    localStorage.setItem("difficultyLevel", difficultyLevel);

    WORD_SIZE = parseInt(wordSize);
    NUMBER_OF_GUESSES = parseInt(guessCount);
    level = parseInt(difficultyLevel);
    document.getElementById("settings-modal").style.display = "none";

    restartGame();
});

resetBtn.addEventListener("click", () => {
    unloadSettings();
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

function resetKeyBoard() {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "";
    }
}

function restartGame() {
    rightGuessString = "";
    setTimeout(async () => {
        rightGuessString = await getWordsByFrequency(WORD_SIZE, level);
        setBoard();
        resetKeyBoard();
    }, 0);
    const board = document.getElementById("board");
    board.innerHTML = "";
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    loadSettings();
}

function unloadSettings() {
    const wordSizeOptions = document.querySelectorAll("#wordSize > option");
    wordSizeOptions.forEach((element) => {
        if (element.innerHTML.includes("(Default)")) {
            element.setAttribute("selected", "selected");
        } else {
            element.removeAttribute("selected");
        }
    });

    const guessCountOptions = document.querySelectorAll("#guessCount > option");
    guessCountOptions.forEach((element) => {
        if (element.innerHTML.includes("Default")) {
            element.setAttribute("selected", "selected");
        } else {
            element.removeAttribute("selected");
        }
    });

    const levelOptions = document.querySelectorAll("#level > option");
    levelOptions.forEach((element) => {
        if (element.innerHTML.includes("(Default)")) {
            element.setAttribute("selected", "selected");
        } else {
            element.removeAttribute("selected");
        }
    });
}
