import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-employee-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit-modal.component.html',
  styleUrl: './employee-edit-modal.component.css',
})
export class EmployeeEditModalComponent {
  @Input() employee: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      basicDetails: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        designation: ['', Validators.required],
        role: ['', Validators.required],
        experienceYears: ['', Validators.required],
        experienceMonths: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    if (this.employee) {
      this.editForm.patchValue(this.employee);
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.save.emit(this.editForm.value);
    }
  }
}
