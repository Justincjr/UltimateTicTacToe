import { motion } from 'framer-motion';
import './PlayerSelect.css';

interface PlayerSelectProps {
  onSelect: (player: number) => void;
  isLoading: boolean;
}

function PlayerSelect({ onSelect, isLoading }: PlayerSelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="player-select"
    >
      <h2 className="select-title">Choose Your Side</h2>
      <p className="select-subtitle">Play as X (first) or O (second)</p>
      
      <div className="player-options">
        <motion.button
          className="player-button x-button"
          onClick={() => onSelect(1)}
          disabled={isLoading}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="player-symbol x-symbol">X</span>
          <span className="player-label">Play First</span>
          <span className="player-desc">You move first</span>
        </motion.button>

        <motion.button
          className="player-button o-button"
          onClick={() => onSelect(2)}
          disabled={isLoading}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="player-symbol o-symbol">O</span>
          <span className="player-label">Play Second</span>
          <span className="player-desc">AI moves first</span>
        </motion.button>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Starting game...</span>
        </div>
      )}

      <div className="rules-hint">
        <h3>How to Play</h3>
        <p>Win 3 small boards in a row to win the game. Your move determines which board your opponent plays in next!</p>
      </div>
    </motion.div>
  );
}

export default PlayerSelect;
