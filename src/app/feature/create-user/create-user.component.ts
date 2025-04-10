/* eslint-disable @typescript-eslint/no-explicit-any */
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// services and configs
import { ACTION_TYPE } from 'src/app/shared/configs/app.constants';
import { DataService } from 'src/app/shared/services/data.service';
import { UsersService } from '../users/users.service';
// components
import {
  FairFoodInputComponent,
  FfDropdownComponent,
} from 'fairfood-form-components';
import { ButtonsComponent } from 'fairfood-utils';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    FairFoodInputComponent,
    FfDropdownComponent,
    ButtonsComponent,
    MatIconModule,
  ],
})
export class CreateUserComponent {
  apiSub: Subscription;
  userForm: FormGroup;
  submitted: boolean;
  pageApis: Subscription[] = [];
  roles: any[] = [
    {
      id: '2',
      name: 'Super admin',
    },
    {
      id: '3',
      name: 'Manager',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UsersService,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  close() {
    this.dialogRef.close();
  }

  dropDownValueAddres(data: any): void {
    const selected = data?.id === 'All' ? '' : data.id;
    this.userForm.patchValue({
      role: selected,
    });
  }

  inviteUser(): void {
    this.submitted = true;

    if (this.userForm.valid) {
      const { email, firstName, lastName, password, role } =
        this.userForm.value;

      const reqObj = {
        email,
        image: '',
        type: role,
        password,
        new_password: password,
        first_name: firstName,
        last_name: lastName,
      };
      this.apiSub = this.userService.createNewUser(reqObj).subscribe(
        () => {
          this.dataService.customSnackBar(
            'User invited successfully',
            ACTION_TYPE.SUCCESS
          );
          this.dialogRef.close(true);
        },
        err => {
          const { error } = err;
          this.dataService.customSnackBar(error.detail[0], ACTION_TYPE.FAILED);
        }
      );
    }
  }
}
