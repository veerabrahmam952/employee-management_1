import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { IndexDBService } from '../../services/indexdb.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Employee } from '../../services/indexdb.service';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockIndexDBService: jasmine.SpyObj<IndexDBService>;

  const mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Flutter Developer',
      joinDate: new Date('2024-01-01'),
      endDate: null
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Product Designer',
      joinDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31')
    }
  ];

  beforeEach(async () => {
    mockIndexDBService = jasmine.createSpyObj('IndexDBService', ['deleteEmployee']);
    mockIndexDBService.employees = jasmine.createSpyObj('WritableSignal', ['set', 'get']);
    mockIndexDBService.employees.and.returnValue(mockEmployees);

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent, BrowserAnimationsModule],
      providers: [
        { provide: IndexDBService, useValue: mockIndexDBService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display employee list when employees exist', () => {
    const compiled = fixture.nativeElement;
    const employeeCards = compiled.querySelectorAll('.employee-card');
    expect(employeeCards.length).toBe(2);
  });

  it('should display empty state when no employees exist', () => {
    mockIndexDBService.employees.set([]);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const emptyState = compiled.querySelector('.text-center');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('No Employees Found');
  });

  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toMatch(/Jan \d{1,2}, 2024/);
  });

  it('should show form when add button is clicked', () => {
    const addButton = fixture.nativeElement.querySelector('button[mat-fab]');
    addButton.click();
    fixture.detectChanges();
    
    expect(component.showForm).toBe(true);
  });

  it('should call deleteEmployee when delete button is clicked and confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockIndexDBService.deleteEmployee.and.returnValue(Promise.resolve());

    const deleteButton = fixture.nativeElement.querySelectorAll('button[color="warn"]')[0];
    deleteButton.click();
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockIndexDBService.deleteEmployee).toHaveBeenCalledWith(1);
  });

  it('should not delete employee when delete is not confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    const deleteButton = fixture.nativeElement.querySelectorAll('button[color="warn"]')[0];
    deleteButton.click();
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockIndexDBService.deleteEmployee).not.toHaveBeenCalled();
  });

  it('should set showForm to true and call setEmployee when edit button is clicked', () => {
    const editButton = fixture.nativeElement.querySelectorAll('button[color="primary"]')[0];
    spyOn(component.employeeForm, 'setEmployee');
    
    editButton.click();
    fixture.detectChanges();
    
    expect(component.showForm).toBe(true);
    setTimeout(() => {
      expect(component.employeeForm.setEmployee).toHaveBeenCalledWith(mockEmployees[0]);
    });
  });
});