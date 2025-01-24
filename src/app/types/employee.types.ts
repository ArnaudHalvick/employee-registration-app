export interface Employee {
  basicDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    designation: string;
    role: string;
    experienceYears: number;
    experienceMonths: number;
  };
  addressDetails: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  educationDetails: {
    educationEntries: Array<{
      degree: string;
      university: string;
      graduationYear: number;
      specialization?: string;
    }>;
  };
  professionalDetails: {
    skills: string[];
    certifications: string[];
    previousEmployers: string[];
    projectsWorked: string[];
  };
}
