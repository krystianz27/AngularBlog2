import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { IUser } from '../../../../core/interfaces/models/user.model.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  userService = inject(UserService);
  fb = inject(FormBuilder);

  userForm: FormGroup = this.fb.group({
    name: [''],
    email: ['', [, Validators.email]],
    password: ['', Validators.minLength(6)],
  });

  user?: IUser;
  successMessage: string | null = null;

  constructor() {
    this.loadUser();
  }

  loadUser() {
    this.userService.getUserDetails().subscribe((data) => {
      this.user = data;
      this.userForm.patchValue({ name: data.name, email: data.email });
    });
  }

  saveChanges() {
    const formValue = { ...this.userForm.value };

    if (!formValue.password) {
      delete formValue.password;
    }

    this.userService.updateUser(formValue).subscribe({
      next: () => {
        this.successMessage = 'User data has been updated!';
        setTimeout(() => {
          this.successMessage = null;
        }, 7000);
      },
      error: (error) => {
        console.error(error);
        this.successMessage = 'An error occurred while updating user data.';
        setTimeout(() => {
          this.successMessage = null;
        }, 7000);
      },
    });
  }
}
