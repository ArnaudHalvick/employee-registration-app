import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeEditModalComponent } from '../employee-edit-modal/employee-edit-modal.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, EmployeeEditModalComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  employees: any[] = [];
  showEditModal = false;
  selectedEmployee: any = null;

  constructor() {
    this.loadEmployees();
  }

  loadEmployees() {
    const storedEmployees = localStorage.getItem('employees');
    this.employees = storedEmployees ? JSON.parse(storedEmployees) : [];
  }

  openEditModal(employee: any) {
    this.selectedEmployee = { ...employee };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEmployee = null;
  }

  saveEditedEmployee(editedEmployee: any) {
    const index = this.employees.findIndex(
      (emp) => emp.basicDetails.email === editedEmployee.basicDetails.email
    );

    if (index !== -1) {
      this.employees[index] = editedEmployee;
      localStorage.setItem('employees', JSON.stringify(this.employees));
      this.loadEmployees();
    }

    this.closeEditModal();
  }

  deleteEmployee(employee: any) {
    if (confirm('Are you sure you want to delete this employee?')) {
      const index = this.employees.findIndex(
        (emp) => emp.basicDetails.email === employee.basicDetails.email
      );

      if (index !== -1) {
        this.employees.splice(index, 1);
        localStorage.setItem('employees', JSON.stringify(this.employees));
        this.loadEmployees();
      }
    }
  }
}
