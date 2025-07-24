import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, SquareComponent],
  templateUrl: './board.html',
  styleUrls: ['./board.scss']
})
export class BoardComponent {
  @Input() squares: ('X' | 'O' | null)[] = Array(9).fill(null);
  @Input() active = true;

  @Output() moveMade = new EventEmitter<number>();

  makeMove(idx: number) {
    if (!this.active || this.squares[idx]) {
      return; // ignore if inactive or square occupied
    }
    this.moveMade.emit(idx); // emit the move to parent to handle
  }

  calculateWinner(): 'X' | 'O' | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        this.squares[a] && 
        this.squares[a] === this.squares[b] && 
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }
}
