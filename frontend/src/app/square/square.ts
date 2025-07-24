import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './square.html',
  styleUrls: ['./square.scss'],
})
export class SquareComponent  {

  @Input() value: 'X' | 'O' | null | undefined;
  @Input() highlight: boolean = false;

}