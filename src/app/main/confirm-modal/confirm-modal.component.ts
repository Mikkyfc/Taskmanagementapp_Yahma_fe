import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
   @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm';
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
