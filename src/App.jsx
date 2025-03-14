import { motion } from 'motion/react';
import Game from './components/Game';
import Layout from './components/Layout';
import Header from './components/Header/Header';
import { ThemeProvider } from './context/ThemeContext';
import styles from './App.module.css';

function App() {
	return (
		<ThemeProvider>
			<Layout>
				<motion.div 
					className={styles.app}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<Header />
					<div className={styles.gameWrapper}>
						<Game />
					</div>
				</motion.div>
			</Layout>
		</ThemeProvider>
	);
}

export default App;
