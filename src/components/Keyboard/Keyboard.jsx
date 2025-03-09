import React from "react";
import styles from "./Keyboard.module.css";
import clsx from "clsx";

const getKeyboardStatus = (userGuesses) => {
	let keyboardStatus = {};
	const evaluatedUserGuesses = userGuesses.flat();
	evaluatedUserGuesses.forEach(({ letter, status }) => {
		const currentStatus = keyboardStatus[letter];

		if (currentStatus === undefined) {
			keyboardStatus[letter] = status;
			return;
		}

		const STATUS_RANKS = {
			correct: 1,
			misplaced: 2,
			incorrect: 3,
		};

		const currentStatusRank = STATUS_RANKS[currentStatus];
		const newStatusRank = STATUS_RANKS[status];

		if (newStatusRank < currentStatusRank) {
			keyboardStatus[letter] = status;
		}
	});
	return keyboardStatus;
};

function Keyboard({ userGuesses }) {
	const ROWS = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Z", "X", "C", "V", "B", "N", "M"],
	];

	const keyboardStatus = getKeyboardStatus(userGuesses);
	return (
		<div className={clsx(styles.keyboard)}>
			{ROWS.map((keyboardRow, index) => (
				<div key={index} className={clsx(styles["keyboard-row"])}>
					{keyboardRow.map((letter) => (
						<div
							key={letter}
							className={clsx(
								styles.letter,
								styles[keyboardStatus[letter]]
							)}
						>
							{letter}
						</div>
					))}
				</div>
			))}
		</div>
	);
}

export default Keyboard;
