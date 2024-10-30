import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/models/user.model.interface';
import { share } from 'rxjs';

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  session?: Session;

  constructor() {
    let session = localStorage.getItem('session');
    if (session) {
      this.session = JSON.parse(session);
    }
  }

  login({ email, password }: { email: string; password: string }) {
    let db = this.http
      .post<Session>(environment.BACKEND_API_URL + '/api/auth/login', {
        email: email,
        password: password,
      })
      .pipe(share());

    db.subscribe({
      next: (session: Session) => {
        this.session = session;
        localStorage.setItem('session', JSON.stringify(session));
        console.log('Session saved:', session);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error:', error);
      },
    });

    return db;
  }

  logout() {
    this.session = undefined;
    localStorage.removeItem('session');
    this.router.navigate(['']);
  }

  register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    console.log(name);
    return this.http.post(environment.BACKEND_API_URL + '/api/auth/register', {
      name,
      email,
      password,
    });
  }

  forgotPassword(email: String) {
    return this.http.post(
      environment.BACKEND_API_URL + '/api/auth/forgot-password',
      { email }
    );
  }

  resetPassword({ token, password }: { token: string; password: string }) {
    return this.http.post(
      environment.BACKEND_API_URL + '/api/auth/reset-password',
      { token, password }
    );
  }
}
