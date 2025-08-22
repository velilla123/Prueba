import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-add-task-modal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule
  ],
  templateUrl: './add-task-modal.html',
  styleUrl: './add-task-modal.scss'
})
export class AddTaskModal implements OnInit {
  @Input() taskToEdit: any | null = null;
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() taskAdded = new EventEmitter<{ title: string; completed: boolean }>();
  @Output() modalClosed = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      completed: [false]
    });
  }

  ngOnInit(): void {
    if (this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        completed: this.taskToEdit.completed
      });
    }
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const { title, completed } = this.taskForm.value;
      this.taskAdded.emit({ title, completed });
      this.closeModal();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.isVisibleChange.emit(false);
  }
}
