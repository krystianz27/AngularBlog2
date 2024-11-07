import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  successMessage: string | null = null;

  ngOnInit() {
    this.messageService.currentMessage.subscribe((message) => {
      this.successMessage = message;
      if (message) {
        setTimeout(() => {
          this.successMessage = null;
          this.messageService.clearMessage();
        }, 30000);
      }
    });
  }

  submit() {
    this.authService
      .login({
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe({
        // next: () => (window.location.href = '/'),
        next: () => console.log('Login success!!'),
        error: (error) => {
          if (error && error.error && error.error.message) {
            alert(error.error.message);
          }
          console.error(error);
        },
      });
  }
}
