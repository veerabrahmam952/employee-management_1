import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { IndexDBService } from '../services/indexdb.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { startOfToday, nextMonday, nextTuesday, addDays } from 'date-fns';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let mockIndexDBService: jasmine.SpyObj<IndexDBService>;

  beforeEach(async () => {
    mockIndexDBService = jasmine.createSpyObj('IndexDBService', ['addEmployee', 'updateEmployee']);

    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: IndexDBService, useValue: mockIndexDBService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default employee values', () => {
    expect(component.employee).toEqual({
      name: '',
      email: '',
      position: '',
      joinDate: jasmine.any(Date),
      endDate: null
    });
  });

  it('should set join date to today when setJoinDate("today") is called', () => {
    const today = startOfToday();
    component.setJoinDate('today');
    expect(component.employee.joinDate.getTime()).toBe(today.getTime());
  });

  it('should set join date to next Monday when setJoinDate("nextMonday") is called', () => {
    const expectedDate = nextMonday(startOfToday());
    component.setJoinDate('nextMonday');
    expect(component.employee.joinDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should set join date to next Tuesday when setJoinDate("nextTuesday") is called', () => {
    const expectedDate = nextTuesday(startOfToday());
    component.setJoinDate('nextTuesday');
    expect(component.employee.joinDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should set join date to after 1 week when setJoinDate("nextWeek") is called', () => {
    const expectedDate = addDays(startOfToday(), 7);
    component.setJoinDate('nextWeek');
    expect(component.employee.joinDate.getTime()).toBe(expectedDate.getTime());
  });

  it('should set end date to null when setEndDate("noDate") is called', () => {
    component.setEndDate('noDate');
    expect(component.employee.endDate).toBeNull();
  });

  it('should set end date to today when setEndDate("today") is called', () => {
    const today = startOfToday();
    component.setEndDate('today');
    expect(component.employee.endDate?.getTime()).toBe(today.getTime());
  });

  it('should emit closeForm event when onCancel is called', () => {
    spyOn(component.closeForm, 'emit');
    component.onCancel();
    expect(component.closeForm.emit).toHaveBeenCalled();
  });

  it('should reset form when resetForm is called', () => {
    component.employee = {
      name: 'Test',
      email: 'test@test.com',
      position: 'Developer',
      joinDate: new Date(),
      endDate: new Date()
    };
    component.editMode = true;

    component.resetForm();

    expect(component.employee).toEqual({
      name: '',
      email: '',
      position: '',
      joinDate: jasmine.any(Date),
      endDate: null
    });
    expect(component.editMode).toBeFalse();
  });
});