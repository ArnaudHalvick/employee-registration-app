import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';

interface Step {
  stepName: string;
  isCompleted: boolean;
  content: string;
}

interface ProfessionalEntry {
  value: string;
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
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

  readonly MAX_SKILLS = 8;
  readonly MAX_CERTIFICATIONS = 8;
  readonly MAX_EMPLOYERS = 5;
  readonly MAX_PROJECTS = 5;

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
      phone: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
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
      postalCode: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
      ]),
    }),
    educationDetails: new FormGroup({
      /* ... */
    }),
    professionalDetails: new FormGroup({
      skills: new FormArray<FormControl<string>>([]),
      certifications: new FormArray<FormControl<string>>([]),
      previousEmployers: new FormArray<FormControl<string>>([]),
      projectsWorked: new FormArray<FormControl<string>>([]),
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

  addSkill() {
    if (this.skillsArray.length < this.MAX_SKILLS) {
      this.skillsArray.push(new FormControl('', Validators.required));
    }
  }

  addCertification() {
    if (this.certificationsArray.length < this.MAX_CERTIFICATIONS) {
      this.certificationsArray.push(new FormControl('', Validators.required));
    }
  }

  addEmployer() {
    if (this.employersArray.length < this.MAX_EMPLOYERS) {
      this.employersArray.push(new FormControl('', Validators.required));
    }
  }

  addProject() {
    if (this.projectsArray.length < this.MAX_PROJECTS) {
      this.projectsArray.push(new FormControl('', Validators.required));
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

  nextStep() {
    if (this.currentStep() === 1 && !this.basicDetailsValid) {
      return;
    }
    if (this.currentStep() === 2 && !this.addressDetailsValid) {
      return;
    }
    this.currentStep.update((step) => step + 1);
  }

  previousStep() {
    this.currentStep.update((step) => step - 1);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      // Handle form submission
    }
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
  }
}
