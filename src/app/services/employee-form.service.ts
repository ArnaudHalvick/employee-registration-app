import { Injectable, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { Employee } from '../types/employee.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeFormService {
  private fb = inject(NonNullableFormBuilder);

  createEmployeeForm(): FormGroup {
    return this.fb.group({
      basicDetails: this.createBasicDetailsGroup(),
      addressDetails: this.createAddressDetailsGroup(),
      educationDetails: this.createEducationDetailsGroup(),
      professionalDetails: this.createProfessionalDetailsGroup(),
    });
  }

  private createBasicDetailsGroup() {
    return this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      designation: [''],
      role: [''],
      experienceYears: [0, Validators.required],
      experienceMonths: [0, Validators.required],
    });
  }

  private createAddressDetailsGroup() {
    return this.fb.group({
      street: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      state: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      postalCode: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  private createEducationDetailsGroup() {
    return this.fb.group({
      educationEntries: this.fb.array([]),
    });
  }

  private createProfessionalDetailsGroup() {
    return this.fb.group({
      skills: this.fb.array<string>([]),
      certifications: this.fb.array<string>([]),
      previousEmployers: this.fb.array<string>([]),
      projectsWorked: this.fb.array<string>([]),
    });
  }

  addFormArrayControl(array: FormArray) {
    array.push(this.fb.control('', { validators: Validators.required }));
  }

  addEducationGroup(array: FormArray) {
    const educationGroup = this.fb.group({
      degree: ['', Validators.required],
      university: ['', Validators.required],
      graduationYear: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      specialization: [''],
    });
    array.push(educationGroup);
  }

  prepareEmployeeData(form: FormGroup): Employee {
    const formData = form.getRawValue();

    return {
      basicDetails: {
        ...formData.basicDetails,
        experienceYears: Number(formData.basicDetails.experienceYears),
        experienceMonths: Number(formData.basicDetails.experienceMonths),
      },
      addressDetails: formData.addressDetails,
      educationDetails: {
        educationEntries: formData.educationDetails.educationEntries.map(
          (entry: any) => ({
            ...entry,
            graduationYear: Number(entry.graduationYear),
          })
        ),
      },
      professionalDetails: {
        skills: formData.professionalDetails.skills || [],
        certifications: formData.professionalDetails.certifications || [],
        previousEmployers: formData.professionalDetails.previousEmployers || [],
        projectsWorked: formData.professionalDetails.projectsWorked || [],
      },
    };
  }

  validateBasicDetails(group: AbstractControl | null): boolean {
    if (!group) return false;
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
    ];
    return requiredFields.every((field) => {
      const control = group.get(field);
      return control?.valid && control?.value;
    });
  }

  validateAddressDetails(group: AbstractControl | null): boolean {
    if (!group) return false;
    const requiredFields = ['street', 'city', 'state', 'country', 'postalCode'];
    return requiredFields.every((field) => {
      const control = group.get(field);
      return control?.valid && control?.value;
    });
  }

  validateEducationDetails(array: FormArray): boolean {
    if (array.length === 0) return true;
    return array.controls.every((group) => {
      const degreeControl = group.get('degree');
      const universityControl = group.get('university');
      const yearControl = group.get('graduationYear');
      return (
        degreeControl?.valid && universityControl?.valid && yearControl?.valid
      );
    });
  }

  markFormAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormAsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormAsTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control.markAsTouched();
      }
    });
  }
}
