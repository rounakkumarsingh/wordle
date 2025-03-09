import clsx from "clsx";
import React from "react";
import styles from "./Banner.module.css";

function Banner({ type = "", answer, userGuessesCount } = {}) {
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
		<div className={clsx(styles[type], styles.banner)}>
			<p>{content}</p>
		</div>
	);
}

export default Banner;
