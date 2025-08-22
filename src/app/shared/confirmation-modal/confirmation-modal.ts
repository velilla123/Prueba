import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss'
})
export class ConfirmationModal {
  @Input() message: string = '¿Estás seguro de que quieres realizar esta acción?';
  @Input() isVisible: boolean = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() isVisibleChange = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirm.emit();
    this.onCancel();
  }

  onCancel(): void {
    this.isVisibleChange.emit(false);
  }
}
