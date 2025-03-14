import { motion, AnimatePresence } from 'framer-motion';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <motion.div
      className={styles.layout}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </motion.div>
  );
};

export default Layout; 