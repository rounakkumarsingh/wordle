import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { range } from "../../utils";
import styles from "./Guess.module.css";
import clsx from "clsx";

function Guess({ guessInput = "" } = {}) {
	return (
		<>
			{range(5).map((index) => (
				<AnimatePresence key={index}>
					<motion.span
						className={clsx(
							styles.cell,
							styles[guessInput?.[index]?.status]
						)}
						initial={{ rotateX: 0 }}
						animate={guessInput?.[index] ? { rotateX: 360 } : { rotateX: 0 }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 20,
							delay: index * 0.1,
						}}
						style={{ transformStyle: "preserve-3d" }}
					>
						{guessInput[index]?.letter ?? " "}
					</motion.span>
				</AnimatePresence>
			))}
		</>
	);
}

export default Guess;
