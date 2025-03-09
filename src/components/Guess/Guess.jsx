import React from "react";
import { range } from "../../utils";
import styles from "./Guess.module.css";
import clsx from "clsx";

function Guess({ guessInput = "" } = {}) {
	return (
		<>
			{range(5).map((index) => (
				<span
					key={index}
					className={clsx(
						styles.cell,
						styles[guessInput?.[index]?.status]
					)}
				>
					{guessInput[index]?.letter ?? " "}
				</span>
			))}
		</>
	);
}

export default Guess;
