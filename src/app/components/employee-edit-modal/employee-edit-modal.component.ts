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
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Employee } from '../../types/employee.types';

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
  styleUrl: './employee-edit-modal.component.css',
})
export class EmployeeEditModalComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  employee = input.required<Employee>();
  close = output<void>();
  save = output<Employee>();

  activeTab = signal<TabType>('basicDetails');

  tabs: TabType[] = [
    'basicDetails',
    'addressDetails',
    'educationDetails',
    'professionalDetails',
  ];

  editForm = this.fb.group({
    basicDetails: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      designation: ['', Validators.required],
      role: ['', Validators.required],
      experienceYears: [0, [Validators.required, Validators.min(0)]],
      experienceMonths: [0, [Validators.required, Validators.min(0)]],
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

  isFormValid = computed(() => this.editForm.valid);

  formErrors = computed(() => {
    const errors: Record<TabType, boolean> = {
      basicDetails: !this.editForm.get('basicDetails')?.valid,
      addressDetails: !this.editForm.get('addressDetails')?.valid,
      educationDetails: !this.editForm.get('educationDetails')?.valid,
      professionalDetails: !this.editForm.get('professionalDetails')?.valid,
    };
    return errors;
  });

  constructor() {
    effect(() => {
      const employeeData = this.employee();
      if (employeeData) {
        this.editForm.patchValue(employeeData);
      }
    });
  }

  setActiveTab(tab: TabType): void {
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

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedEmployee = this.editForm.getRawValue() as Employee;
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const index = employees.findIndex(
        (emp: Employee) =>
          emp.basicDetails.email === updatedEmployee.basicDetails.email
      );

      if (index !== -1) {
        employees[index] = updatedEmployee;
        localStorage.setItem('employees', JSON.stringify(employees));
        this.save.emit(updatedEmployee);
      }
    } else {
      // Find first invalid tab and switch to it
      const firstInvalidTab = this.tabs.find((tab) => this.formErrors()[tab]);
      if (firstInvalidTab) {
        this.setActiveTab(firstInvalidTab);
      }
    }
  }
}
