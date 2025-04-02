import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IndexDBService } from '../services/indexdb.service';
import { EmployeeFormComponent } from './employee-form.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    EmployeeFormComponent
  ],
  templateUrl: './employee-list.component.html',
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep {
      .mat-mdc-select-panel {
        background-color: white !important;
        @apply shadow-lg;
      }
      .mat-calendar {
        background-color: white !important;
        @apply shadow-lg rounded-lg;
      }
      .mdc-button {
        @apply bg-primary-100 hover:bg-primary-200;
      }
      .mat-mdc-raised-button.mat-primary {
        @apply bg-primary-600 hover:bg-primary-700;
      }
      .mat-mdc-fab.mat-primary {
        @apply bg-primary-600 hover:bg-primary-700 fixed bottom-6 right-6 z-50;
      }
      .mat-warn {
        @apply bg-red-100 hover:bg-red-200 text-red-700;
      }
    }
  `]
})
export class EmployeeListComponent {
  dbService = inject(IndexDBService);
  @ViewChild('employeeForm') employeeForm!: EmployeeFormComponent;
  showForm = false;

  formatDate(date: Date): string {
    return formatDate(date, 'mediumDate', 'en-US');
  }

  editEmployee(employee: any) {
    this.showForm = true;
    setTimeout(() => {
      this.employeeForm.setEmployee(employee);
    });
  }

  async deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      await this.dbService.deleteEmployee(id);
    }
  }
}