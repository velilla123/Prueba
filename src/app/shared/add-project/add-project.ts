import { Component, OnInit, OnChanges, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule
  ],
  templateUrl: './add-project.html',
  styleUrl: './add-project.scss'
})
export class AddProject {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Output() projectAdd = new EventEmitter<{ name: string; username: string, email: string, address: any, phone: string, website: string, company: any }>();
  @Output() modalClosed = new EventEmitter<void>();

  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required, Validators.maxLength(100)]],
        suite: ['', [Validators.required, Validators.maxLength(50)]],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
      }),
      phone: [''],
      website: [''],
      company: this.fb.group({
        nameCompany: ['', [Validators.required]],
        catchPhrase: ['', [Validators.required]],
        bs: ['', [Validators.required]],
      })
    });
  }

  saveProject(): void {
    if (this.projectForm.valid) {
      const { name, username, email, address, phone, website, company } = this.projectForm.value;
      this.projectAdd.emit({ name, username, email, address, phone, website, company });
      this.closeModal();
    } else {
      this.projectForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.isVisibleChange.emit(false);
  }
}
