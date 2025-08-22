import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-modify-address',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './modify-address.html',
  styleUrl: './modify-address.scss'
})
export class ModifyAddress implements OnInit, OnChanges {
  @Input() addressToEdit: any | null = null;
  @Input() isVisible: boolean = false;

  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() modifyAddress = new EventEmitter<{ street: string; suite: string; city: string; zipcode: string }>();

  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(100)]],
      suite: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });
  }

  ngOnInit(): void {
    this.loadAddressData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addressToEdit'] && this.addressToEdit) {
      this.loadAddressData();
    }
  }

  private loadAddressData(): void {
    if (this.addressToEdit) {
      this.addressForm.patchValue({
        street: this.addressToEdit.street,
        suite: this.addressToEdit.suite,
        city: this.addressToEdit.city,
        zipcode: this.addressToEdit.zipcode
      });
    } else {
      this.addressForm.reset();
    }
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      this.modifyAddress.emit(this.addressForm.value);
      this.closeModal();
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.isVisibleChange.emit(false);
  }
}
