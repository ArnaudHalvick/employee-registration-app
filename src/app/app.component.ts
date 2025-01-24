import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

interface EmployeeBasicDetails {
  firstName: string;
  lastName: string;
  designation: string;
  role: string;
  phone: string;
  email: string;
  experienceYears: number;
  experienceMonths: number;
  address: {
    city: string;
    state: string;
    postalCode: string;
    streetAddress: string;
  };
}

interface Skill {
  name: string;
  yearsOfExperience: number;
}

interface WorkExperience {
  company: string;
  startDate: Date;
  endDate: Date;
  designation: string;
  project: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private fb = inject(FormBuilder);

  title = 'employee-registration-app';
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

  basicDetailsForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    designation: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    experienceYears: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    experienceMonths: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(11),
    ]),
    address: new FormGroup({
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$'),
      ]),
      streetAddress: new FormControl('', [Validators.required]),
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
    this.setActiveStep(this.activeStepIndex + 1);
  }

  saveEmployee() {
    if (
      this.basicDetailsForm.valid &&
      this.skillsForm.valid &&
      this.experienceForm.valid
    ) {
      const employeeData = {
        basicDetails: this.basicDetailsForm.value,
        skills: this.skillsForm.value.skills,
        experiences: this.experienceForm.value.experiences,
      };
      // Store in localStorage
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      employees.push(employeeData);
      localStorage.setItem('employees', JSON.stringify(employees));

      // Reset forms
      this.basicDetailsForm.reset();
      this.skillsForm.reset();
      this.experienceForm.reset();
      this.setActiveStep(0);
    }
  }

  setActiveStep(index: number): void {
    this.activeStepIndex = index;
    this.progressWidth = index === 0 ? 8 : index === 1 ? 50 : 100;
  }
}
