import { motion } from 'framer-motion';
import Game from './components/Game';
import Layout from './components/Layout/Layout';
import styles from './App.module.css';

function App() {
	return (
		<Layout>
			<motion.div 
				className={styles.app}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<Game />
			</motion.div>
		</Layout>
	);
}

export default App;
