import { Component, OnInit, OnChanges, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-modal.html',
  styleUrl: './add-task-modal.scss'
})
export class AddTaskModal implements OnInit, OnChanges {
  @Input() taskToEdit: any | null = null;

  @Output() taskAdded = new EventEmitter<{ title: string; completed: boolean }>();
  @Output() modalClosed = new EventEmitter<void>();

  taskTitle: string = '';
  isCompleted: boolean = false;

  ngOnInit(): void {
    this.loadTaskData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit']) {
      this.loadTaskData();
    }
  }

  private loadTaskData(): void {
    if (this.taskToEdit) {
      this.taskTitle = this.taskToEdit.title;
      this.isCompleted = this.taskToEdit.completed;
    } else {
      this.taskTitle = '';
      this.isCompleted = false;
    }
  }

  saveTask(): void {
    if (this.taskTitle.trim()) {
      this.taskAdded.emit({ title: this.taskTitle, completed: this.isCompleted });
    }
  }

  cancel(): void {
    this.modalClosed.emit();
  }
}
