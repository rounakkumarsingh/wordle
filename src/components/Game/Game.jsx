import { useState } from "react";

import { sample } from "./../../utils";
import { WORDS } from "../../data";
import GuessInput from "../GuessInput";
import UserGuesses from "../UserGuesses";
import Banner from "../Banner";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import { checkGuess } from "../../utils/game-helpers";
import Keyboard from "../Keyboard";

function Game() {
	const [answer, setAnswer] = useState(() => sample(WORDS));
	const [userGuesses, setUserGuesses] = useState([]);
	const [gameOver, setGameOver] = useState(false);

	function handleRestart() {
		const newAnswer = sample(WORDS);
		setAnswer(newAnswer);
		setUserGuesses([]);
		setGameOver(false);
	}

	const addGuess = (guess) => {
		if (userGuesses.length === NUM_OF_GUESSES_ALLOWED) return;
		const nextUserGuesses = [...userGuesses];
		nextUserGuesses.push(checkGuess(guess, answer));
		setUserGuesses(nextUserGuesses);
		if (
			nextUserGuesses.length === NUM_OF_GUESSES_ALLOWED ||
			guess === answer
		)
			setGameOver(true);
	};

	return (
		<>
			{gameOver && (
				<Banner
					handleRestart={handleRestart}
					type={
						userGuesses[userGuesses.length - 1]
							.map((item) => item.letter)
							.join("") === answer
							? "happy"
							: "sad"
					}
					answer={answer}
					userGuessesCount={userGuesses.length}
				/>
			)}
			<UserGuesses userGuesses={userGuesses} />
			<GuessInput addUserGuesss={addGuess} gameOver={gameOver} />
			<Keyboard userGuesses={userGuesses} />
		</>
	);
}

export default Game;
