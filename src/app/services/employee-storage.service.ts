import { Injectable } from '@angular/core';
import { Employee } from '../types/employee.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeStorageService {
  getEmployees(): Employee[] {
    return JSON.parse(localStorage.getItem('employees') || '[]');
  }

  addEmployee(employee: Employee): boolean {
    const employees = this.getEmployees();

    if (this.isDuplicateEmail(employee.basicDetails.email)) {
      return false;
    }

    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
    return true;
  }

  private isDuplicateEmail(email: string): boolean {
    return this.getEmployees().some((emp) => emp.basicDetails.email === email);
  }
}
