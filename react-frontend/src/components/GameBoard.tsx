import { motion } from 'framer-motion';
import './GameBoard.css';

interface GameState {
  board: number[][][][];
  fill_num: number;
  prev_local_action: [number, number] | null;
  local_board_status: number[][];
}

interface GameBoardProps {
  state: GameState;
  validActions: number[][];
  humanFill: number;
  isTerminal: boolean;
  isLoading: boolean;
  onMove: (action: number[]) => void;
}

function GameBoard({ state, validActions, humanFill, isTerminal, isLoading, onMove }: GameBoardProps) {
  const isValidMove = (superRow: number, superCol: number, localRow: number, localCol: number) => {
    return validActions.some(
      action => action[0] === superRow && action[1] === superCol && 
                action[2] === localRow && action[3] === localCol
    );
  };

  const isActiveBoard = (superRow: number, superCol: number) => {
    return validActions.some(action => action[0] === superRow && action[1] === superCol);
  };

  const getBoardStatus = (superRow: number, superCol: number) => {
    const status = state.local_board_status[superRow][superCol];
    if (status === 1) return 'x-won';
    if (status === 2) return 'o-won';
    if (status === 3) return 'draw';
    return '';
  };

  const getCellContent = (value: number) => {
    if (value === 1) return <span className="cell-x">X</span>;
    if (value === 2) return <span className="cell-o">O</span>;
    return null;
  };

  const getBoardWinner = (superRow: number, superCol: number) => {
    const status = state.local_board_status[superRow][superCol];
    if (status === 1) return <span className="board-winner x">X</span>;
    if (status === 2) return <span className="board-winner o">O</span>;
    if (status === 3) return <span className="board-winner draw">—</span>;
    return null;
  };

  const canClick = state.fill_num === humanFill && !isTerminal && !isLoading;

  return (
    <motion.div 
      className="game-board"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="super-grid">
        {[0, 1, 2].map(superRow => (
          <div key={superRow} className="super-row">
            {[0, 1, 2].map(superCol => {
              const boardStatus = getBoardStatus(superRow, superCol);
              const isActive = isActiveBoard(superRow, superCol) && canClick;
              
              return (
                <div 
                  key={superCol}
                  className={`mini-board ${boardStatus} ${isActive ? 'active' : ''}`}
                >
                  {boardStatus && (
                    <div className="board-overlay">
                      {getBoardWinner(superRow, superCol)}
                    </div>
                  )}
                  
                  <div className="local-grid">
                    {[0, 1, 2].map(localRow => (
                      <div key={localRow} className="local-row">
                        {[0, 1, 2].map(localCol => {
                          const cellValue = state.board[superRow][superCol][localRow][localCol];
                          const isValid = isValidMove(superRow, superCol, localRow, localCol);
                          const isEmpty = cellValue === 0;
                          
                          return (
                            <motion.button
                              key={localCol}
                              className={`cell ${isEmpty && isValid && canClick ? 'valid' : ''} ${!isEmpty ? 'filled' : ''}`}
                              onClick={() => {
                                if (isValid && canClick) {
                                  onMove([superRow, superCol, localRow, localCol]);
                                }
                              }}
                              disabled={!isValid || !canClick}
                              whileHover={isValid && canClick ? { scale: 1.1 } : {}}
                              whileTap={isValid && canClick ? { scale: 0.95 } : {}}
                            >
                              {getCellContent(cellValue)}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default GameBoard;
