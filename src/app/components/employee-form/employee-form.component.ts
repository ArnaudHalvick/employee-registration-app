import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { EmployeeDataService } from '../../services/employee-data.service';
import { EmployeeFormService } from '../../services/employee-form.service';
import { EmployeeConstantsService } from '../../services/employee-constants.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  private router = inject(Router);
  private employeeData = inject(EmployeeDataService);
  private formService = inject(EmployeeFormService);
  private constants = inject(EmployeeConstantsService);

  currentStep = signal(1);
  employeeForm: FormGroup;

  designations = this.constants.designations;
  roles = this.constants.roles;

  readonly MAX_SKILLS = this.constants.MAX_SKILLS;
  readonly MAX_CERTIFICATIONS = this.constants.MAX_CERTIFICATIONS;
  readonly MAX_EMPLOYERS = this.constants.MAX_EMPLOYERS;
  readonly MAX_PROJECTS = this.constants.MAX_PROJECTS;
  readonly MAX_EDUCATION_ENTRIES = this.constants.MAX_EDUCATION_ENTRIES;

  constructor() {
    this.employeeForm = this.formService.createEmployeeForm();
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
      this.formService.addFormArrayControl(this.skillsArray);
    }
  }

  addCertification() {
    if (this.certificationsArray.length < this.MAX_CERTIFICATIONS) {
      this.formService.addFormArrayControl(this.certificationsArray);
    }
  }

  addEmployer() {
    if (this.employersArray.length < this.MAX_EMPLOYERS) {
      this.formService.addFormArrayControl(this.employersArray);
    }
  }

  addProject() {
    if (this.projectsArray.length < this.MAX_PROJECTS) {
      this.formService.addFormArrayControl(this.projectsArray);
    }
  }

  addEducation() {
    if (this.educationArray.length < this.MAX_EDUCATION_ENTRIES) {
      this.formService.addEducationGroup(this.educationArray);
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
    if (this.currentStep() === 1 && !this.basicDetailsValid) return;
    if (this.currentStep() === 2 && !this.addressDetailsValid) return;
    if (this.currentStep() === 3 && !this.educationDetailsValid) return;
    this.currentStep.update((step) => step + 1);
  }

  previousStep() {
    this.currentStep.update((step) => step - 1);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeData = this.formService.prepareEmployeeData(
        this.employeeForm
      );

      if (this.employeeData.addEmployee(employeeData)) {
        this.router.navigate(['/list']);
      } else {
        alert('An employee with this email already exists.');
      }
    } else {
      this.formService.markFormAsTouched(this.employeeForm);
    }
  }

  get basicDetailsValid(): boolean {
    return this.formService.validateBasicDetails(
      this.employeeForm.get('basicDetails')
    );
  }

  get addressDetailsValid(): boolean {
    return this.formService.validateAddressDetails(
      this.employeeForm.get('addressDetails')
    );
  }

  get educationDetailsValid(): boolean {
    return this.formService.validateEducationDetails(this.educationArray);
  }

  ngOnInit() {
    if (this.educationArray.length === 0) {
      this.addEducation();
    }
  }
}
