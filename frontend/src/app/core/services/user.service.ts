import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/models/user.model.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.BACKEND_API_URL + '/api/users';
  private httpClient = inject(HttpClient);

  getUserDetails(): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.baseUrl}/me`);
  }

  updateUser({
    name,
    email,
    password,
  }: {
    name?: string;
    email?: string;
    password?: string;
  }): Observable<IUser> {
    return this.httpClient.put<IUser>(`${this.baseUrl}`, {
      name,
      email,
      password,
    });
  }

  deleteUser(): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}`);
  }
}
