//not yet implemented in mini project

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalService } from '../services/portal.service';

@Component({
  selector: 'app-manage-admins',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mt-3">
      <div class="card-header">Manage Admins</div>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let admin of admins">
              <td>{{ admin.username }}</td>
              <td>{{ admin.email }}</td>
              <td>{{ admin.role }}</td>
              <td>
                <button class="btn btn-sm btn-success me-2" (click)="grant(admin)">Grant</button>
                <button class="btn btn-sm btn-danger" (click)="revoke(admin)">Revoke</button>
              </td>
            </tr>
            <tr *ngIf="admins.length === 0">
              <td colspan="4" class="text-center text-muted">No admins found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ManageAdminsComponent implements OnInit {
  admins: any[] = [];

  constructor(private svc: PortalService) { }

  ngOnInit(): void {
    this.svc.getAdmins().subscribe({
      next: (r: any) => this.admins = r,
      error: (e) => console.error('Error loading admins', e)
    });
  }

  grant(admin: any): void {
    this.svc.grantAdmin(admin.id).subscribe({
      next: () => alert(`Granted admin privileges to ${admin.username}`),
      error: (e) => alert('Error granting admin: ' + e.message)
    });
  }

  revoke(admin: any): void {
    this.svc.revokeAdmin(admin.id).subscribe({
      next: () => alert(`Revoked admin privileges from ${admin.username}`),
      error: (e) => alert('Error revoking admin: ' + e.message)
    });
  }
}
