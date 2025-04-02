import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EmployeeListComponent } from './app/components/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-primary-600 text-white p-4">
        <h1 class="text-2xl font-bold">Employee Management</h1>
      </header>
      
      <main class="container mx-auto py-8">
        <app-employee-list></app-employee-list>
      </main>
    </div>
  `
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideAnimations()
  ]
}).catch(err => console.error(err));