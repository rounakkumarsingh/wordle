import React from "react";
import Guess from "../Guess";
import { range } from "../../utils";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import styles from "./UserGuesses.module.css";
import clsx from "clsx";

function UserGuesses({ userGuesses }) {
	return (
		<div className={clsx(styles.guessResults)}>
			{range(NUM_OF_GUESSES_ALLOWED).map((index) => (
				<p key={index} className={clsx(styles.guess)}>
					<Guess guessInput={userGuesses[index]} />
				</p>
			))}
		</div>
	);
}

export default UserGuesses;
