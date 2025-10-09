import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PortalService } from '../services/portal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  applications: any[] = [];
  isLoading = true;
  errorMsg = '';

  constructor(private svc: PortalService, private router: Router) { }

  ngOnInit() {
    this.svc.getApplications().subscribe({
      next: (data: any[]) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading applications', err);
        this.errorMsg = 'Failed to load applications.';
        this.isLoading = false;
      }
    });
  }

  delete(appId: number): void {
    if (confirm(`Are you sure you want to delete application ${appId}?`)) {
      this.svc.deleteApplication(String(appId)).subscribe({
        next: () => {
          this.applications = this.applications.filter(app => app.id !== appId);
          alert('Application deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete application', err);
          alert('Failed to delete application.');
        }
      });
    }
  }
}