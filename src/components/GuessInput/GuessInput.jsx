import { useState } from "react";
import styles from "./GuessInput.module.css";
import clsx from "clsx";

function GuessInput({ addUserGuesss, gameOver }) {
	const [guess, setGuess] = useState("");
	return (
		<form
			className={clsx(styles["guess-input-wrapper"])}
			onSubmit={(event) => {
				event.preventDefault();
				if (guess.length !== 5) return;
				addUserGuesss(guess);
				setGuess("");
			}}
		>
			<label htmlFor="guess-input">Enter Guess: </label>
			<input
				id="guess-input"
				type="text"
				value={guess}
				minLength={5}
				maxLength={5}
				pattern="[a-zA-Z]{5}"
				title="5 letter word"
				disabled={gameOver}
				onChange={(event) => setGuess(event.target.value.toUpperCase())}
			></input>
			{/* The issue occurs when the .toUpperCase() method actually changes the characters entered.This isn't a problem with React specifically; I was able to reproduce the same issue in vanilla JavaScript and HTML. For some reason, transforming the value on an input causes the minLength attribute to fail. */}
		</form>
	);
}

export default GuessInput;
