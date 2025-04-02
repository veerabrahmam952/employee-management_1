import { Component, inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { IndexDBService, Employee } from '../services/indexdb.service';
import { addDays, nextMonday, nextTuesday, startOfToday } from 'date-fns';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './employee-form.component.html',
  styles: [`
    :host {
      display: block;
    }
    .employee-form {
      padding: 1.5rem;
    }
    ::ng-deep {
      .mat-datepicker-content {
        background-color: white !important;
        @apply shadow-lg rounded-lg;
        
        .mat-calendar {
          width: auto;
        }
        
        button {
          @apply bg-primary-100 hover:bg-primary-200;
        }
      }
      
      .mat-mdc-select-panel {
        background-color: white !important;
        @apply shadow-lg;
      }
      
      .mdc-button {
        @apply bg-primary-100 hover:bg-primary-200;
      }
      
      .mat-mdc-raised-button.mat-primary {
        @apply bg-primary-600 hover:bg-primary-700;
      }
    }
  `]
})
export class EmployeeFormComponent {
  private dbService = inject(IndexDBService);
  @Output() closeForm = new EventEmitter<void>();
  
  roles = [
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner'
  ];

  employee: Employee = {
    name: '',
    position: '',
    joinDate: new Date(),
    endDate: null
  };
  
  editMode = false;

  setJoinDate(type: string) {
    const today = startOfToday();
    switch (type) {
      case 'today':
        this.employee.joinDate = today;
        break;
      case 'nextMonday':
        this.employee.joinDate = nextMonday(today);
        break;
      case 'nextTuesday':
        this.employee.joinDate = nextTuesday(today);
        break;
      case 'nextWeek':
        this.employee.joinDate = addDays(today, 7);
        break;
    }
  }

  setEndDate(type: string) {
    switch (type) {
      case 'noDate':
        this.employee.endDate = null;
        break;
      case 'today':
        this.employee.endDate = startOfToday();
        break;
    }
  }

  async onSubmit() {
    if (this.editMode && this.employee.id) {
      await this.dbService.updateEmployee(this.employee);
    } else {
      await this.dbService.addEmployee(this.employee);
    }
    this.resetForm();
    this.closeForm.emit();
  }

  onCancel() {
    this.resetForm();
    this.closeForm.emit();
  }

  resetForm() {
    this.employee = {
      name: '',
      position: '',
      joinDate: new Date(),
      endDate: null
    };
    this.editMode = false;
  }

  setEmployee(employee: Employee) {
    this.employee = { ...employee };
    this.editMode = true;
  }
}