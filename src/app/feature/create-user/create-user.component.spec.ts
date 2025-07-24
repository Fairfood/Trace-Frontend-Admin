import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUserComponent } from './create-user.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { UsersService } from '../users/users.service';
import { DataService } from 'src/app/shared/services/data.service';
import { ACTION_TYPE } from 'src/app/shared/configs/app.constants';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CreateUserComponent>>;
  let mockUserService: jasmine.SpyObj<UsersService>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockUserService = jasmine.createSpyObj('UsersService', ['createNewUser']);
    mockDataService = jasmine.createSpyObj('DataService', ['customSnackBar']);

    TestBed.configureTestingModule({
      imports: [CreateUserComponent, ReactiveFormsModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UsersService, useValue: mockUserService },
        { provide: DataService, useValue: mockDataService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.userForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    });
  });

  it('should call inviteUser when form is valid', () => {
    component.userForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: '2',
    });

    mockUserService.createNewUser.and.returnValue(of({}));

    component.inviteUser();

    expect(mockUserService.createNewUser).toHaveBeenCalledWith({
      email: 'john.doe@example.com',
      image: '',
      type: '2',
      password: undefined,
      new_password: undefined,
      first_name: 'John',
      last_name: 'Doe',
    });
    expect(mockDataService.customSnackBar).toHaveBeenCalledWith(
      'User invited successfully',
      ACTION_TYPE.SUCCESS
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should display error if inviteUser fails', () => {
    component.userForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: '2',
    });

    mockUserService.createNewUser.and.returnValue(
      throwError({ error: { detail: ['Error message'] } })
    );

    component.inviteUser();

    expect(mockDataService.customSnackBar).toHaveBeenCalledWith(
      'Error message',
      ACTION_TYPE.FAILED
    );
  });

  it('should call close on dialogRef when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should update role when dropDownValueAddres is called with valid data', () => {
    const mockData = { id: '2' };
    component.dropDownValueAddres(mockData);
    expect(component.userForm.value.role).toBe('2');
  });

  it('should update role to empty when dropDownValueAddres is called with "All" data', () => {
    const mockData = { id: 'All' };
    component.dropDownValueAddres(mockData);
    expect(component.userForm.value.role).toBe('');
  });
});
