import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeeConstantsService {
  readonly designations = [
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
  ] as const;

  readonly roles = [
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
  ] as const;

  readonly MAX_SKILLS = 8;
  readonly MAX_CERTIFICATIONS = 8;
  readonly MAX_EMPLOYERS = 5;
  readonly MAX_PROJECTS = 5;
  readonly MAX_EDUCATION_ENTRIES = 5;
}
