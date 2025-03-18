import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { StringNull } from './auth.type';
import { Observable, of } from 'rxjs';
import { checkVal } from '@client/utils'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8000/api/auth';

  token = signal<string | null>(localStorage.getItem('token'));

  login(email: StringNull , password: StringNull, defaultRoute?: StringNull) {
    try {
      checkVal(email, password);
      return this.http.post<{ email: string, token: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
        tap((res) => {
          this.token.set(res.token);
          localStorage.setItem("token", res.token);
          localStorage.setItem("email", res.email);
          this.router.navigate([defaultRoute || "/"])
        })
      );
    }
    catch(err) {
      console.log("Login: ", err);
      return of(err);
    }
  }

  register(email: StringNull, password: StringNull, defaultRoute?: StringNull) {
    try {
      checkVal(email, password);
      return this.http.post<{ email: string, token: string }>(`${this.baseUrl}/register`, { email, password }).pipe(
        tap((res) => {
          this.token.set(res.token);
          localStorage.setItem('token', res.token);
          localStorage.setItem("email", res.email);
          this.router.navigate([defaultRoute || "/"])
        })
      );
    }
    catch(err) {
      console.log("Register: ", err);
      return of(err);
    }
    
  }

  verifyToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return of(false);

    return this.http.get<boolean>(`${this.baseUrl}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(() => of(false))
    );
  }
}
