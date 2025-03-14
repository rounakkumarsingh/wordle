import { useState } from "react";
import { motion } from "motion/react";
import styles from "./GuessInput.module.css";
import clsx from "clsx";

function GuessInput({ addUserGuesss, gameOver }) {
	const [guess, setGuess] = useState("");
	return (
		<motion.form
			className={clsx(styles["guess-input-wrapper"])}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			onSubmit={(event) => {
				event.preventDefault();
				if (guess.length !== 5) return;
				addUserGuesss(guess);
				setGuess("");
			}}
		>
			<motion.label
				htmlFor="guess-input"
				initial={{ x: -20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				Enter Guess:{" "}
			</motion.label>
			<motion.input
				id="guess-input"
				type="text"
				value={guess}
				minLength={5}
				maxLength={5}
				pattern="[a-zA-Z]{5}"
				title="5 letter word"
				disabled={gameOver}
				onChange={(event) => setGuess(event.target.value.toUpperCase())}
				whileFocus={{ scale: 1.05 }}
				transition={{ type: "spring", stiffness: 300, damping: 30 }}
			></motion.input>
			{/* The issue occurs when the .toUpperCase() method actually changes the characters entered.This isn't a problem with React specifically; I was able to reproduce the same issue in vanilla JavaScript and HTML. For some reason, transforming the value on an input causes the minLength attribute to fail. */}
		</motion.form>
	);
}

export default GuessInput;
