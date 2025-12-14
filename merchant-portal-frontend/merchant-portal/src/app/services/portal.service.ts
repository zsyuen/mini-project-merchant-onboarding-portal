import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PortalService {

  // Use a base URL for the entire API.
  private apiBase = environment.apiBase;

  constructor(private http: HttpClient) { }

  updateApplicationStatus(id: string, status: string): Observable<any> {
    const payload = { status: status };
    return this.http.put(`${this.apiBase}/applications/${id}/status`, payload);
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiBase}/applications/${id}`);
  }

  submitApplication(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiBase}/applications`, formData).pipe(
    tap(res => console.log('✅ FormData submit response:', res)),
    catchError(err => {
      console.error('❌ Service Error:', err);
      return throwError(() => err);
    })
  );
  }

  /* 
    Check application status by reference ID
  */

  //Fetches a single application by its reference ID.
  getApplicationByRef(refId: string): Observable<any> {
    return this.http.get(`${this.apiBase}/applications/ref/${refId}`);
  }

  //Fetches a single application by its database ID.
  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiBase}/applications/${id}`);
  }

   //Fetches all merchant applications.
  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/applications`);
  }


  //Not yet implemented in mini project
  /**
   * Creates a new admin user.
   */
  createAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/admins`, data);
  }

  /**
   * Fetches all admin users.
   */
  getAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/admins`);
  }

  /**
   * Grants admin privileges to a user.
   */
  grantAdmin(adminId: number): Observable<any> {
    return this.http.post(`${this.apiBase}/admins/${adminId}/grant`, {});
  }

  /**
   * Revokes admin privileges from a user.
   */
  revokeAdmin(adminId: number): Observable<any> {
    return this.http.post(`${this.apiBase}/admins/${adminId}/revoke`, {});
  }
}