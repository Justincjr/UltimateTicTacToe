import { motion } from 'framer-motion';
import './GameStatus.css';

interface GameStatusProps {
  currentTurn: number;
  humanFill: number;
  isTerminal: boolean;
  result: 'win' | 'lose' | 'draw' | null;
  isLoading: boolean;
}

function GameStatus({ currentTurn, humanFill, isTerminal, result, isLoading }: GameStatusProps) {
  const isHumanTurn = currentTurn === humanFill && !isLoading;
  const humanSymbol = humanFill === 1 ? 'X' : 'O';
  const aiSymbol = humanFill === 1 ? 'O' : 'X';

  const getStatusMessage = () => {
    if (isTerminal) {
      switch (result) {
        case 'win': return '🎉 You Win!';
        case 'lose': return '😢 AI Wins';
        case 'draw': return "🤝 It's a Draw!";
      }
    }
    if (isLoading) return 'AI is thinking...';
    return isHumanTurn ? 'Your Turn' : 'AI Turn';
  };

  const getStatusClass = () => {
    if (isTerminal) {
      return result === 'win' ? 'status-win' : result === 'lose' ? 'status-lose' : 'status-draw';
    }
    return isHumanTurn ? 'status-human' : 'status-ai';
  };

  return (
    <motion.div 
      className={`game-status ${getStatusClass()}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="status-info">
        <div className="player-info">
          <span className={`symbol ${humanFill === 1 ? 'x' : 'o'}`}>
            {humanSymbol}
          </span>
          <span className="label">You</span>
        </div>
        
        <div className="status-message">
          {isLoading && !isTerminal && (
            <div className="thinking-dots">
              <span></span><span></span><span></span>
            </div>
          )}
          <span>{getStatusMessage()}</span>
        </div>

        <div className="player-info">
          <span className={`symbol ${humanFill === 1 ? 'o' : 'x'}`}>
            {aiSymbol}
          </span>
          <span className="label">AI</span>
        </div>
      </div>

      {!isTerminal && (
        <div className="turn-indicator">
          <motion.div 
            className="turn-marker"
            animate={{ 
              left: isHumanTurn ? '0%' : '50%',
              backgroundColor: isHumanTurn ? 'var(--x-color)' : 'var(--o-color)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default GameStatus;
