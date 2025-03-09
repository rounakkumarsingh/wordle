import Game from "./components/Game";
import Header from "./components/Header";
import styles from "./App.module.css";
import clsx from "clsx";

function App() {
	return (
		<div className={clsx(styles.wrapper)}>
			<Header />

			<div className={clsx(styles.gameWrapper)}>
				<Game />
			</div>
		</div>
	);
}

export default App;
