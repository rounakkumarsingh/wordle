import React from "react";
import { motion } from "motion/react";
import { range } from "../../utils";
import styles from "./Guess.module.css";
import clsx from "clsx";

function Guess({ guessInput = "" } = {}) {
	return (
		<>
			{range(5).map((index) => (
				<motion.span
					key={index}
					className={clsx(
						styles.cell,
						styles[guessInput?.[index]?.status]
					)}
					initial={guessInput?.[index] ? { opacity: 0, scale: 0.5 } : false}
					animate={guessInput?.[index] ? { 
						opacity: 1,
						scale: 1
					} : false}
					transition={{
						duration: 0.3,
						delay: guessInput?.[index] ? index * 0.2 : 0
					}}
				>
					{guessInput[index]?.letter ?? " "}
				</motion.span>
			))}
		</>
	);
}

export default Guess;
