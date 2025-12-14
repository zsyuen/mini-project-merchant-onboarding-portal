import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private authTokenKey = 'auth-token';
  private authRoleKey = 'auth-role';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        this.saveRole(response.role);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  saveRole(role: string): void {
    localStorage.setItem(this.authRoleKey, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.authRoleKey);
  }

  // Check if user is a Reviewer (Super Admin)
  isReviewer(): boolean {
    return this.getRole() === 'reviewer';
  }

  isAuthenticated(): boolean {
    // Check if a token exists
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.authRoleKey);
    this.router.navigate(['/officer/login']);
  }
}