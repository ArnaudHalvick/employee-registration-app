import { Component, signal, inject, OnInit } from '@angular/core';
import { Employee } from '../../types/employee.types';
import { RouterLink, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  NonNullableFormBuilder,
} from '@angular/forms';
import { EmployeeStorageService } from '../../services/employee-storage.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private employeeStorage = inject(EmployeeStorageService);
  currentStep = signal(1);

  activeStepIndex = 0;
  progressWidth = 8;

  designations = [
    'Software Engineer',
    'Senior Software Engineer',
    'Tech Lead',
    'Project Manager',
    'Product Manager',
    'Business Analyst',
    'QA Engineer',
    'DevOps Engineer',
    'UI/UX Designer',
    'Data Scientist',
  ];

  roles = [
    'Admin',
    'Team Lead',
    'Senior Developer',
    'Junior Developer',
    'Guest',
    'Manager',
    'Architect',
    'Consultant',
    'Intern',
    'Contractor',
  ];

  readonly MAX_SKILLS = 8;
  readonly MAX_CERTIFICATIONS = 8;
  readonly MAX_EMPLOYERS = 5;
  readonly MAX_PROJECTS = 5;
  readonly MAX_EDUCATION_ENTRIES = 5;

  employeeForm = this.fb.group({
    basicDetails: this.fb.group({
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
    }),
    addressDetails: this.fb.group({
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
    }),
    educationDetails: this.fb.group({
      educationEntries: this.fb.array([]),
    }),
    professionalDetails: this.fb.group({
      skills: this.fb.array<string>([]),
      certifications: this.fb.array<string>([]),
      previousEmployers: this.fb.array<string>([]),
      projectsWorked: this.fb.array<string>([]),
    }),
  });

  skillsForm = this.fb.group({
    skills: this.fb.array<string>([]),
  });

  experienceForm = this.fb.group({
    experiences: this.fb.array<string>([]),
  });

  // Helper getters
  get skills() {
    return this.skillsForm.get('skills') as FormArray;
  }

  get experiences() {
    return this.experienceForm.get('experiences') as FormArray;
  }

  get skillsArray() {
    return this.employeeForm.get('professionalDetails.skills') as FormArray;
  }

  get certificationsArray() {
    return this.employeeForm.get(
      'professionalDetails.certifications'
    ) as FormArray;
  }

  get employersArray() {
    return this.employeeForm.get(
      'professionalDetails.previousEmployers'
    ) as FormArray;
  }

  get projectsArray() {
    return this.employeeForm.get(
      'professionalDetails.projectsWorked'
    ) as FormArray;
  }

  get educationArray() {
    return this.employeeForm.get(
      'educationDetails.educationEntries'
    ) as FormArray;
  }

  addSkill() {
    if (this.skillsArray.length < this.MAX_SKILLS) {
      this.skillsArray.push(
        this.fb.control('', { validators: Validators.required })
      );
    }
  }

  addCertification() {
    if (this.certificationsArray.length < this.MAX_CERTIFICATIONS) {
      this.certificationsArray.push(
        this.fb.control('', { validators: Validators.required })
      );
    }
  }

  addEmployer() {
    if (this.employersArray.length < this.MAX_EMPLOYERS) {
      this.employersArray.push(
        this.fb.control('', { validators: Validators.required })
      );
    }
  }

  addProject() {
    if (this.projectsArray.length < this.MAX_PROJECTS) {
      this.projectsArray.push(
        this.fb.control('', { validators: Validators.required })
      );
    }
  }

  addEducation() {
    if (this.educationArray.length < this.MAX_EDUCATION_ENTRIES) {
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

      this.educationArray.push(educationGroup);
    }
  }

  removeSkill(index: number) {
    this.skillsArray.removeAt(index);
  }

  removeCertification(index: number) {
    this.certificationsArray.removeAt(index);
  }

  removeEmployer(index: number) {
    this.employersArray.removeAt(index);
  }

  removeProject(index: number) {
    this.projectsArray.removeAt(index);
  }

  removeEducation(index: number) {
    this.educationArray.removeAt(index);
  }

  nextStep() {
    if (this.currentStep() === 1 && !this.basicDetailsValid) {
      return;
    }
    if (this.currentStep() === 2 && !this.addressDetailsValid) {
      return;
    }
    if (this.currentStep() === 3 && !this.educationDetailsValid) {
      return;
    }
    this.currentStep.update((step) => step + 1);
  }

  previousStep() {
    this.currentStep.update((step) => step - 1);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.getRawValue();

      const employeeData: Employee = {
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
          previousEmployers:
            formData.professionalDetails.previousEmployers || [],
          projectsWorked: formData.professionalDetails.projectsWorked || [],
        },
      };

      if (this.employeeStorage.addEmployee(employeeData)) {
        this.router.navigate(['/list']);
      } else {
        alert('An employee with this email already exists.');
      }
    } else {
      this.markFormAsTouched(this.employeeForm);
    }
  }

  private markFormAsTouched(formGroup: FormGroup) {
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

  setActiveStep(index: number): void {
    this.activeStepIndex = index;
    this.progressWidth = index === 0 ? 8 : index === 1 ? 50 : 100;
  }

  get basicDetailsValid(): boolean {
    const basicDetails = this.employeeForm.get('basicDetails');
    if (!basicDetails) return false;

    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
    ];
    const isValid = requiredFields.every((field) => {
      const control = basicDetails.get(field);
      return control && control.valid && control.value;
    });

    return isValid;
  }

  get addressDetailsValid(): boolean {
    const addressDetails = this.employeeForm.get('addressDetails');
    if (!addressDetails) return false;

    const requiredFields = ['street', 'city', 'state', 'country', 'postalCode'];
    const isValid = requiredFields.every((field) => {
      const control = addressDetails.get(field);
      return control && control.valid && control.value;
    });

    return isValid;
  }

  checkBasicDetailsValidation() {
    const basicDetails = this.employeeForm.get('basicDetails') as FormGroup;
    if (!basicDetails) return;
  }

  get educationDetailsValid(): boolean {
    if (this.educationArray.length === 0) return true;

    return this.educationArray.controls.every((group) => {
      const degreeControl = group.get('degree');
      const universityControl = group.get('university');
      const yearControl = group.get('graduationYear');

      return (
        degreeControl?.valid && universityControl?.valid && yearControl?.valid
      );
    });
  }

  ngOnInit() {
    // Initialize form validation
    const basicDetails = this.employeeForm.get('basicDetails') as FormGroup;
    const addressDetails = this.employeeForm.get('addressDetails') as FormGroup;

    if (basicDetails) {
      Object.values(basicDetails.controls).forEach(
        (control: AbstractControl) => {
          control.updateValueAndValidity();
        }
      );
    }

    if (addressDetails) {
      Object.values(addressDetails.controls).forEach(
        (control: AbstractControl) => {
          control.updateValueAndValidity();
        }
      );
    }

    this.employeeForm.get('basicDetails')?.valueChanges.subscribe(() => {
      this.checkBasicDetailsValidation();
    });

    // Add initial education entry if array is empty
    if (this.educationArray.length === 0) {
      this.addEducation();
    }
  }
}
