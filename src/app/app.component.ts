import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Step {
  stepName: string;
  isCompleted: boolean;
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'employee-registration-app';
  activeStepIndex = 0;

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

  setActiveStep(index: number): void {
    this.activeStepIndex = index;
  }
}
