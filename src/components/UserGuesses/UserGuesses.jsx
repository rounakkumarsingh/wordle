import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Guess from "../Guess";
import { range } from "../../utils";
import { NUM_OF_GUESSES_ALLOWED } from "../../constants";
import styles from "./UserGuesses.module.css";

function UserGuesses({ userGuesses }) {
	return (
		<div className={styles["guess-results"]}>
			<AnimatePresence>
				{range(NUM_OF_GUESSES_ALLOWED).map((index) => (
					<motion.p
						key={index}
						className={styles.guess}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							type: "spring",
							stiffness: 200,
							damping: 20,
							duration: 0.2
						}}
					>
						<Guess guessInput={userGuesses[index]} />
					</motion.p>
				))}
			</AnimatePresence>
		</div>
	);
}

export default UserGuesses;
