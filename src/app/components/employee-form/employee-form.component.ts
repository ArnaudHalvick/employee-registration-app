import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';

interface Step {
  stepName: string;
  isCompleted: boolean;
  content: string;
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  private fb = inject(FormBuilder);
  currentStep = signal(1);

  activeStepIndex = 0;
  progressWidth = 8;

  stepsList: Step[] = [
    {
      stepName: 'Basic Details',
      isCompleted: false,
      content:
        'Please provide your personal information including full name, email address, and contact details. This information helps us create your employee profile and ensure accurate communication throughout the registration process.',
    },
    {
      stepName: 'Skills',
      isCompleted: false,
      content:
        'List your technical and soft skills, certifications, and proficiency levels. Include programming languages, frameworks, tools, and any relevant professional qualifications that showcase your expertise.',
    },
    {
      stepName: 'Experience',
      isCompleted: false,
      content:
        'Detail your work history, including previous positions, companies, and key responsibilities. Highlight specific projects, achievements, and the duration of each role to give us a comprehensive view of your professional background.',
    },
  ];

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

  employeeForm = new FormGroup({
    basicDetails: new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      designation: new FormControl(''),
      role: new FormControl(''),
      experienceYears: new FormControl(''),
      experienceMonths: new FormControl(''),
      address: new FormGroup({
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
        postalCode: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
        ]),
        streetAddress: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ]),
      }),
    }),
    addressDetails: new FormGroup({
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      state: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      country: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      pincode: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
      ]),
    }),
    educationDetails: new FormGroup({
      /* ... */
    }),
    professionalDetails: new FormGroup({
      /* ... */
    }),
  });

  skillsForm = this.fb.group({
    skills: this.fb.array([]),
  });

  experienceForm = this.fb.group({
    experiences: this.fb.array([]),
  });

  // Helper getters
  get skills() {
    return this.skillsForm.get('skills') as FormArray;
  }

  get experiences() {
    return this.experienceForm.get('experiences') as FormArray;
  }

  addSkill() {
    const skillForm = this.fb.group({
      name: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
    });
    this.skills.push(skillForm);
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  addExperience() {
    const experienceForm = this.fb.group({
      company: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      designation: ['', Validators.required],
      project: ['', Validators.required],
    });
    this.experiences.push(experienceForm);
  }

  removeExperience(index: number) {
    this.experiences.removeAt(index);
  }

  nextStep() {
    this.currentStep.update((step) => step + 1);
  }

  previousStep() {
    this.currentStep.update((step) => step - 1);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
    }
  }

  setActiveStep(index: number): void {
    this.activeStepIndex = index;
    this.progressWidth = index === 0 ? 8 : index === 1 ? 50 : 100;
  }

  get basicDetailsValid(): boolean {
    const basicDetails = this.employeeForm.get('basicDetails') as FormGroup;
    if (!basicDetails) return false;

    Object.values(basicDetails.controls).forEach((control) => {
      control.markAsTouched();
    });

    return (
      (basicDetails.get('firstName')?.valid &&
        basicDetails.get('lastName')?.valid &&
        basicDetails.get('email')?.valid &&
        basicDetails.get('phone')?.valid) ??
      false
    );
  }

  get addressDetailsValid(): boolean {
    const addressDetails = this.employeeForm.get('addressDetails') as FormGroup;
    if (!addressDetails) return false;

    Object.values(addressDetails.controls).forEach((control) => {
      control.markAsTouched();
    });

    return addressDetails.valid;
  }

  ngOnInit() {
    Object.values(this.employeeForm.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((c) => c.markAsTouched());
      }
    });
  }
}
