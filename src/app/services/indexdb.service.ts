import { Injectable, signal } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

export interface Employee {
  id?: number;
  name: string;
  position: string;
  joinDate: Date;
  endDate: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class IndexDBService {
  private db!: IDBPDatabase;
  employees = signal<Employee[]>([]);

  constructor() {
    this.initDB();
  }

  private async initDB() {
    this.db = await openDB('employeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
    await this.loadEmployees();
  }

  private async loadEmployees() {
    const employees = await this.db.getAll('employees');
    this.employees.set(employees);
  }

  async addEmployee(employee: Employee) {
    const id = await this.db.add('employees', employee);
    await this.loadEmployees();
    return id;
  }

  async updateEmployee(employee: Employee) {
    await this.db.put('employees', employee);
    await this.loadEmployees();
  }

  async deleteEmployee(id: number) {
    await this.db.delete('employees', id);
    await this.loadEmployees();
  }
}