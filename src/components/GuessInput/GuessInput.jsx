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
				disabled={gameOver}
				onChange={(event) => setGuess(event.target.value.toUpperCase())}
			></input>
		</form>
	);
}

export default GuessInput;
