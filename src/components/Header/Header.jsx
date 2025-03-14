import React from "react";
import styles from "./Header.module.css";
import ThemeToggle from "../ThemeToggle";

function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.side}></div>
			<h1 className={styles.title}>Wordle</h1>
			<div className={styles.side}>
				<ThemeToggle />
			</div>
		</header>
	);
}

export default Header;
