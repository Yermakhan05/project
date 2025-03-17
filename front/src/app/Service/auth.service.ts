import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, credentials).pipe(
      map((res: any) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);  // Сохранение refresh_token
        this.userSubject.next(res.user);
        return res;
      })
    );
  }

  logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.warn("No refresh token found");
      this.router.navigate(['/main']).then(() => {
        window.location.reload();
      });
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/logout/', { refresh_token: refreshToken })
      .subscribe({
        next: () => {
          this.clearSession();
          this.router.navigate(['/main']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error('Logout error:', err);
          this.clearSession();
          this.router.navigate(['/main']).then(() => {
            window.location.reload();
          });
        }
      });
  }

  private clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}profile/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
