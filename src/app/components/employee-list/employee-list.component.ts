import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeEditModalComponent } from '../employee-edit-modal/employee-edit-modal.component';
import { EmployeeDataService } from '../../services/employee-data.service';
import { Employee } from '../../types/employee.types';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, EmployeeEditModalComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  private employeeData = inject(EmployeeDataService);

  showEditModal = signal(false);
  selectedEmployee = signal<Employee | null>(null);
  employees = this.employeeData.employeeList;

  openEditModal(employee: Employee) {
    this.selectedEmployee.set({ ...employee });
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedEmployee.set(null);
  }

  saveEditedEmployee(editedEmployee: Employee) {
    if (this.employeeData.updateEmployee(editedEmployee)) {
      this.closeEditModal();
    } else {
      alert('Failed to update employee.');
    }
  }

  deleteEmployee(employee: Employee) {
    if (confirm('Are you sure you want to delete this employee?')) {
      if (!this.employeeData.deleteEmployee(employee.basicDetails.email)) {
        alert('Failed to delete employee.');
      }
    }
  }
}
