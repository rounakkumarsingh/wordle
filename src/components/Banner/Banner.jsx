import clsx from "clsx";
import { motion } from "framer-motion";
import styles from "./Banner.module.css";

function Banner({ type = "", answer, userGuessesCount, handleRestart } = {}) {
	let content;
	if (type === "happy") {
		content = (
			<>
				<strong>Congratulations!</strong> Got it in{" "}
				<strong>{userGuessesCount} guesses</strong>.
			</>
		);
	} else {
		content = (
			<>
				{" "}
				Sorry, the correct answer is <strong>{answer}</strong>.
			</>
		);
	}

	return (
		<motion.div 
			className={clsx(styles[type], styles.banner)}
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<motion.p
				initial={{ scale: 0.8 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2 }}
			>
				{content}
			</motion.p>
			<motion.button
				onClick={handleRestart}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				Play Again!!
			</motion.button>
		</motion.div>
	);
}

export default Banner;
