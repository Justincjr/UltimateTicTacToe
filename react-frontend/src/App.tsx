import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import PlayerSelect from './components/PlayerSelect';
import GameStatus from './components/GameStatus';
import './App.css';

interface GameState {
  board: number[][][][];
  fill_num: number;
  prev_local_action: [number, number] | null;
  local_board_status: number[][];
}

interface GameData {
  gameId: string;
  state: GameState;
  validActions: number[][];
  isTerminal: boolean;
  utility: number | null;
  humanFill: number;
  currentTurn: number;
  pendingMove: number[] | null; // Track pending move for optimistic UI
}

function App() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(async (playerChoice: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: playerChoice })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGameData({
          gameId: data.game_id,
          state: data.state,
          validActions: data.valid_actions,
          isTerminal: data.is_terminal,
          utility: data.utility || null,
          humanFill: playerChoice,
          currentTurn: data.current_turn,
          pendingMove: null
        });
      } else {
        setError(data.error || 'Failed to start game');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const makeMove = useCallback(async (action: number[]) => {
    if (!gameData || isLoading) return;
    
    // Optimistic UI update - immediately show the move
    setGameData(prev => {
      if (!prev) return null;
      const newBoard = JSON.parse(JSON.stringify(prev.state.board));
      newBoard[action[0]][action[1]][action[2]][action[3]] = prev.humanFill;
      return {
        ...prev,
        state: {
          ...prev.state,
          board: newBoard
        },
        validActions: [], // Clear valid actions while waiting
        pendingMove: action
      };
    });
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: gameData.gameId,
          action: action
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGameData(prev => prev ? {
          ...prev,
          state: data.state,
          validActions: data.valid_actions,
          isTerminal: data.is_terminal,
          utility: data.utility,
          currentTurn: data.current_turn,
          pendingMove: null
        } : null);
      } else {
        // Revert optimistic update on error
        setError(data.error || 'Failed to make move');
        // Refetch state to revert
        const stateResponse = await fetch(`/api/state?game_id=${gameData.gameId}`);
        const stateData = await stateResponse.json();
        if (stateResponse.ok) {
          setGameData(prev => prev ? {
            ...prev,
            state: stateData.state,
            validActions: stateData.valid_actions,
            isTerminal: stateData.is_terminal,
            utility: stateData.utility,
            currentTurn: stateData.current_turn,
            pendingMove: null
          } : null);
        }
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  }, [gameData, isLoading]);

  const resetGame = useCallback(() => {
    setGameData(null);
    setError(null);
  }, []);

  const getGameResult = () => {
    if (!gameData?.isTerminal || gameData.utility === null) return null;
    
    if (gameData.utility === 0.5) return 'draw';
    if ((gameData.utility === 1 && gameData.humanFill === 1) ||
        (gameData.utility === 0 && gameData.humanFill === 2)) {
      return 'win';
    }
    return 'lose';
  };

  // Check if we're waiting for AI (after human made a move)
  const isWaitingForAI = isLoading && gameData?.pendingMove !== null;

  return (
    <div className="app">
      <header className="header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="title"
        >
          Ultimate Tic Tac Toe
        </motion.h1>
        <p className="subtitle">Challenge the AI</p>
      </header>

      <main className="main">
        <AnimatePresence mode="wait">
          {!gameData ? (
            <PlayerSelect 
              key="select"
              onSelect={startGame} 
              isLoading={isLoading} 
            />
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="game-container"
            >
              <GameStatus 
                currentTurn={gameData.currentTurn}
                humanFill={gameData.humanFill}
                isTerminal={gameData.isTerminal}
                result={getGameResult()}
                isLoading={isWaitingForAI}
              />
              
              <GameBoard 
                state={gameData.state}
                validActions={gameData.validActions}
                humanFill={gameData.humanFill}
                isTerminal={gameData.isTerminal}
                isLoading={isLoading}
                onMove={makeMove}
              />

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="error-message"
                >
                  {error}
                </motion.div>
              )}

              <motion.button 
                className="reset-button"
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Game
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer">
        <p>Built with React & Flask</p>
      </footer>
    </div>
  );
}

export default App;
