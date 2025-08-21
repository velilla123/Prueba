import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modify-address',
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-address.html',
  styleUrl: './modify-address.scss'
})
export class ModifyAddress implements OnInit, OnChanges {
  @Input() addressToEdit: any | null = null;

  @Output() modifyAddress = new EventEmitter<{ street: string; suite: string; city: string; zipcode: string }>();
  @Output() modalClosed = new EventEmitter<void>();

  street: string = '';
  suite: string = '';
  city: string = '';
  zipcode: string = '';

  ngOnInit(): void {
    this.loadAddressData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addressToEdit']) {
      this.loadAddressData();
    }
  }

  private loadAddressData(): void {
    if (this.addressToEdit) {
      this.street = this.addressToEdit.street;
      this.suite = this.addressToEdit.suite;
      this.city = this.addressToEdit.city;
      this.zipcode = this.addressToEdit.zipcode;
    } else {
      this.street = '';
      this.suite = '';
      this.city = '';
      this.zipcode = '';
    }
  }

  saveAddress(): void {
    this.modifyAddress.emit({
      street: this.street.trim(),
      suite: this.suite.trim(),
      city: this.city.trim(),
      zipcode: this.zipcode.trim()
    });
  }

  cancel(): void {
    this.modalClosed.emit();
  }
}
