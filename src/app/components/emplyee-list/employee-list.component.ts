import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IndexDBService } from '../../services/indexdb.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
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
  styleUrl: './employee-list.component.scss'
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