import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from '../board/board';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-global-board',
  standalone: true,
  imports: [CommonModule, BoardComponent, MatButtonModule, MatCardModule],
  templateUrl: './global-board.html',
  styleUrls: ['./global-board.scss'],
})
export class GlobalBoard {
  // Each board has its own squares array (9 squares per board)
  boards: { squares: ('X' | 'O' | null)[]; winner?: 'X' | 'O' | null }[] = [];

  // Which small board is active for the next move; undefined means any board
  activeBoardIndex?: number;

  // Track overall winner of the ultimate tic tac toe game
  winner?: 'X' | 'O' | null;

  // Whose turn it is globally
  xIsNext: boolean = true;

  constructor() {
    this.newGame();
  }

  newGame() {
    this.boards = Array(9)
      .fill(null)
      .map(() => ({ squares: Array(9).fill(null), winner: null }));

    this.activeBoardIndex = undefined;
    this.winner = null;
    this.xIsNext = true;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  // Called when a small board emits a move (square index clicked)
  handleMove(boardIndex: number, squareIndex: number) {
    if (this.winner) return; // game over

    const board = this.boards[boardIndex];

    if (board.winner) return; // board already won

    // If move is allowed on this board
    if (this.activeBoardIndex !== undefined && this.activeBoardIndex !== boardIndex) {
      return;
    }

    if (board.squares[squareIndex]) {
      return; // square already filled
    }

    // Make move
    board.squares[squareIndex] = this.player;

    // Check if small board has winner
    board.winner = this.calculateWinner(board.squares);

    // Check if global game has winner (by checking boards that are won)
    this.winner = this.calculateWinner(
      this.boards.map((b) => b.winner)
    );

    // Switch player
    this.xIsNext = !this.xIsNext;

    // Next active board is the square just played on
    this.activeBoardIndex = this.boards[squareIndex].winner ? undefined : squareIndex;
  }

  // Utility: Calculate winner for a 3x3 board (same as before)
  calculateWinner(squares: ('X' | 'O' | null | undefined)[]): 'X' | 'O' | null | undefined {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }
//   isSquareValid(boardIndex: number, squareIndex: number): boolean {
//   const board = this.boards[boardIndex];

//   if (this.winner) return false;  // game over, no valid squares
//   if (board.winner) return false; // board already won, no moves allowed there

//   // If activeBoardIndex is set, player must move there
//   if (this.activeBoardIndex !== undefined) {
//     if (boardIndex !== this.activeBoardIndex) return false; // wrong board
//   } else {
//     // activeBoardIndex is undefined: player can move on any board not yet won
//     if (board.winner) return false;
//   }

//   // Square must be empty
//   return board.squares[squareIndex] === null;
// }

}
