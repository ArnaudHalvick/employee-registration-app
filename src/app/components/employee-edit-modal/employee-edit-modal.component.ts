import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Employee } from '../../types/employee.types';
import { EmployeeConstantsService } from '../../services/employee-constants.service';

type TabType =
  | 'basicDetails'
  | 'addressDetails'
  | 'educationDetails'
  | 'professionalDetails';

@Component({
  selector: 'app-employee-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-edit-modal.component.html',
  styleUrls: ['./employee-edit-modal.component.css'],
})
export class EmployeeEditModalComponent {
  private fb = inject(FormBuilder);
  private constants = inject(EmployeeConstantsService);

  // Input signal for the Employee to edit
  employee = input<Employee | null>(null);

  // Output signals to close and save
  close = output<void>();
  save = output<Employee>();

  // Active tab signal
  activeTab = signal<TabType>('basicDetails');
  tabs: TabType[] = [
    'basicDetails',
    'addressDetails',
    'educationDetails',
    'professionalDetails',
  ];

  // Shared options
  designations = this.constants.designations;
  roles = this.constants.roles;
  readonly MAX_SKILLS = this.constants.MAX_SKILLS;
  readonly MAX_CERTIFICATIONS = this.constants.MAX_CERTIFICATIONS;
  readonly MAX_EMPLOYERS = this.constants.MAX_EMPLOYERS;
  readonly MAX_PROJECTS = this.constants.MAX_PROJECTS;
  readonly MAX_EDUCATION_ENTRIES = this.constants.MAX_EDUCATION_ENTRIES;

  // Main FormGroup for editing
  editForm: FormGroup = this.fb.group({
    basicDetails: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      designation: ['', Validators.required],
      role: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      experienceMonths: [
        0,
        [Validators.required, Validators.min(0), Validators.max(11)],
      ],
    }),
    addressDetails: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    }),
    educationDetails: this.fb.group({
      educationEntries: this.fb.array([]),
    }),
    professionalDetails: this.fb.group({
      skills: this.fb.array([]),
      certifications: this.fb.array([]),
      previousEmployers: this.fb.array([]),
      projectsWorked: this.fb.array([]),
    }),
  });

  // Compute if the entire form is valid
  isFormValid = computed(() => this.editForm.valid);

  // Check each tab validity
  formErrors = computed(() => {
    return {
      basicDetails: !this.editForm.get('basicDetails')?.valid,
      addressDetails: !this.editForm.get('addressDetails')?.valid,
      educationDetails: !this.editForm.get('educationDetails')?.valid,
      professionalDetails: !this.editForm.get('professionalDetails')?.valid,
    };
  });

  constructor() {
    // Effect to patch the form when employee input changes
    effect(() => {
      const emp = this.employee();
      if (emp) {
        this.patchForm(emp);
      }
    });
  }

  /**
   * Patches the form with the given Employee data
   */
  private patchForm(emp: Employee) {
    // Patch main fields
    this.editForm.patchValue(emp);

    // Clear and repopulate the education entries
    const educationEntries = this.editForm.get(
      'educationDetails.educationEntries'
    ) as FormArray;
    educationEntries.clear();
    emp.educationDetails?.educationEntries.forEach((entry) => {
      educationEntries.push(
        this.fb.group({
          degree: [entry.degree, Validators.required],
          university: [entry.university, Validators.required],
          graduationYear: [
            entry.graduationYear,
            [
              Validators.required,
              Validators.min(1900),
              Validators.max(new Date().getFullYear()),
            ],
          ],
          specialization: [entry.specialization ?? ''],
        })
      );
    });

    // Clear and repopulate skills
    const skills = this.editForm.get('professionalDetails.skills') as FormArray;
    skills.clear();
    emp.professionalDetails?.skills.forEach((skill) => {
      skills.push(this.fb.control(skill, Validators.required));
    });

    // Clear and repopulate certifications
    const certifications = this.editForm.get(
      'professionalDetails.certifications'
    ) as FormArray;
    certifications.clear();
    emp.professionalDetails?.certifications.forEach((cert) => {
      certifications.push(this.fb.control(cert, Validators.required));
    });

    // Clear and repopulate previous employers
    const employers = this.editForm.get(
      'professionalDetails.previousEmployers'
    ) as FormArray;
    employers.clear();
    emp.professionalDetails?.previousEmployers.forEach((employer) => {
      employers.push(this.fb.control(employer, Validators.required));
    });

    // Clear and repopulate projects worked
    const projects = this.editForm.get(
      'professionalDetails.projectsWorked'
    ) as FormArray;
    projects.clear();
    emp.professionalDetails?.projectsWorked.forEach((project) => {
      projects.push(this.fb.control(project, Validators.required));
    });
  }

  // Tab Handling
  setActiveTab(tab: TabType) {
    this.activeTab.set(tab);
  }

  isTabValid(tab: TabType): boolean {
    return !this.formErrors()[tab];
  }

  formatTabLabel(tab: TabType): string {
    return tab
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  // Close the modal
  onClose(): void {
    this.close.emit();
  }

  // Submit the form
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedEmployee = this.editForm.getRawValue() as Employee;

      // Store in local storage
      const employees: Employee[] = JSON.parse(
        localStorage.getItem('employees') || '[]'
      );
      const index = employees.findIndex(
        (emp) => emp.basicDetails.email === updatedEmployee.basicDetails.email
      );
      if (index !== -1) {
        employees[index] = updatedEmployee;
      } else {
        employees.push(updatedEmployee);
      }
      localStorage.setItem('employees', JSON.stringify(employees));

      // Emit the save event
      this.save.emit(updatedEmployee);
    } else {
      // Switch to first invalid tab if needed
      const firstInvalidTab = this.tabs.find((tab) => this.formErrors()[tab]);
      if (firstInvalidTab) {
        this.setActiveTab(firstInvalidTab);
      }
    }
  }

  // =============== Dynamic Array Getters and Handlers ===============

  // Education
  get educationArray(): FormArray {
    return this.editForm.get('educationDetails.educationEntries') as FormArray;
  }

  addEducation(): void {
    this.educationArray.push(
      this.fb.group({
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
      })
    );
  }

  removeEducation(index: number): void {
    this.educationArray.removeAt(index);
  }

  // Skills
  get skillsArray(): FormArray {
    return this.editForm.get('professionalDetails.skills') as FormArray;
  }

  addSkill(): void {
    this.skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  // Certifications
  get certificationsArray(): FormArray {
    return this.editForm.get('professionalDetails.certifications') as FormArray;
  }

  addCertification(): void {
    this.certificationsArray.push(this.fb.control('', Validators.required));
  }

  removeCertification(index: number): void {
    this.certificationsArray.removeAt(index);
  }

  // Previous Employers
  get employersArray(): FormArray {
    return this.editForm.get(
      'professionalDetails.previousEmployers'
    ) as FormArray;
  }

  addEmployer(): void {
    this.employersArray.push(this.fb.control('', Validators.required));
  }

  removeEmployer(index: number): void {
    this.employersArray.removeAt(index);
  }

  // Projects
  get projectsArray(): FormArray {
    return this.editForm.get('professionalDetails.projectsWorked') as FormArray;
  }

  addProject(): void {
    this.projectsArray.push(this.fb.control('', Validators.required));
  }

  removeProject(index: number): void {
    this.projectsArray.removeAt(index);
  }
}
