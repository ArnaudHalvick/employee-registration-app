import { Injectable, signal } from '@angular/core';
import { Employee } from '../types/employee.types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDataService {
  private employees = signal<Employee[]>([]);
  readonly employeeList = this.employees.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const stored = localStorage.getItem('employees');
    if (stored) {
      this.employees.set(JSON.parse(stored));
    }
  }

  addEmployee(employee: Employee): boolean {
    if (this.isDuplicateEmail(employee.basicDetails.email)) {
      return false;
    }
    this.employees.update((emps) => [...emps, employee]);
    this.saveToStorage();
    return true;
  }

  updateEmployee(employee: Employee): boolean {
    const index = this.findEmployeeIndex(employee.basicDetails.email);
    if (index === -1) return false;

    this.employees.update((emps) => {
      const updated = [...emps];
      updated[index] = employee;
      return updated;
    });
    this.saveToStorage();
    return true;
  }

  deleteEmployee(email: string): boolean {
    const initialLength = this.employees().length;
    this.employees.update((emps) =>
      emps.filter((emp) => emp.basicDetails.email !== email)
    );

    if (this.employees().length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getEmployeeByEmail(email: string): Employee | undefined {
    return this.employees().find((emp) => emp.basicDetails.email === email);
  }

  private isDuplicateEmail(email: string): boolean {
    return this.employees().some((emp) => emp.basicDetails.email === email);
  }

  private findEmployeeIndex(email: string): number {
    return this.employees().findIndex(
      (emp) => emp.basicDetails.email === email
    );
  }

  private saveToStorage(): void {
    localStorage.setItem('employees', JSON.stringify(this.employees()));
  }
}
