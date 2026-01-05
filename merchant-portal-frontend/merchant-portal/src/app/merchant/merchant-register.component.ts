import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortalService } from '../services/portal.service';
import * as faceapi from 'face-api.js'; // Ensure this is imported

@Component({
  selector: 'app-merchant-register',
  templateUrl: './merchant-register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class MerchantRegisterComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  // --- 1. Webcam Variables ---
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraActive = false;
  isImageCaptured = false;
  isFaceDetected = false;
  capturedImagePreview: string | null = null;
  capturedImageBlob: Blob | null = null;

  constructor(private fb: FormBuilder, private portal: PortalService) { }

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      businessRegNo: ['', Validators.required],
      companyName: ['', Validators.required],
      incorporationDate: ['', Validators.required],
      countryOfCorp: ['', Validators.required],
      merchantNameEn: ['', Validators.required],
      merchantNameLocal: ['', Validators.required],
      taxId: ['', Validators.required],
      entityType: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      address3: [''],
      address4: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal: ['', [Validators.required, Validators.pattern('^[0-9]{4,10}$')]],
      country: ['', Validators.required],
      phone1: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      phone2: ['', Validators.pattern('^[0-9]+$')],
      ownerFirstName: ['', Validators.required],
      ownerLastName: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerDob: ['', Validators.required],
      ownerIdNo: ['', Validators.required],
      ownerNationality: ['', Validators.required],
      ownerIdFront: [null, Validators.required],
      ownerIdBack: [null, Validators.required],
      industry: ['', Validators.required],
      businessType: ['', Validators.required],
      numEmployees: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      schemeRequired: ['', Validators.required],
      facilityRequired: ['', Validators.required],
      proofOfBusiness: [null, Validators.required],
    });

    // --- 2. Load Face API Models (Keep this at the end of ngOnInit) ---
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'), ]).then(() => console.log('✅ Models Loaded: SSD MobileNet + Landmarks'));
    }

  // --- 3. New Camera Methods (Add these here) ---

  startCamera() {
    this.isImageCaptured = false;
    this.capturedImageBlob = null;
    this.isCameraActive = true;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.detectFace(); // Start detection loop
      })
      .catch(err => console.error("Camera error:", err));
  }

  async detectFace() {
  if (!this.isCameraActive || this.isImageCaptured) return;

  const video = this.videoElement.nativeElement;
  
  if(video.readyState === 4) {
    // Use SsdMobilenetv1Options instead of TinyFace
    // minConfidence: 0.5 is a good baseline for this model
    const detections = await faceapi.detectAllFaces(
      video, 
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
    );
    
    this.isFaceDetected = detections.length > 0;
  }

  requestAnimationFrame(() => this.detectFace());
}

  capturePhoto() {
    if (!this.isFaceDetected) {
      alert("No face detected! Please position yourself clearly.");
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    // Get Blob for Upload
    canvas.toBlob((blob) => {
      this.capturedImageBlob = blob;
      this.capturedImagePreview = canvas.toDataURL('image/jpeg');
      this.isImageCaptured = true;
      this.isCameraActive = false;

      // Stop stream
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }, 'image/jpeg');
  }

  // --- 4. Updated Submit Method ---

  submit(): void {
    // Check form validity AND image capture
    if (this.form.invalid || !this.capturedImageBlob) {
      this.form.markAllAsTouched();
      if (!this.capturedImageBlob) alert("Please take a selfie verification photo.");
      console.error('Form is invalid or photo missing.');
      return;
    }

    this.submitting = true;
    const formData = new FormData();
    const formValues = this.form.getRawValue();

    Object.keys(formValues).forEach(key => {
      formData.append(key, formValues[key]);
    });

    // Append the captured selfie
    formData.append('liveSelfie', this.capturedImageBlob, 'selfie.jpg');

    this.portal.submitApplication(formData).subscribe({
      next: (res) => {
        this.submitting = false;
        console.log('Submission successful!', res);
        alert(`Application submitted successfully!\nYour Reference ID is: ${res.referenceId}`);
        this.form.reset();
        this.isImageCaptured = false;
        this.capturedImageBlob = null;
        this.capturedImagePreview = null;
      },
      error: (err) => {
        this.submitting = false;
        console.error('Submission failed:', err);
        alert('Submission failed. Please try again.');
      },
    });
  }

  // --- Helper Methods ---

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }

  onFileChange(event: Event, controlName: string): void {
    const control = this.form.get(controlName);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      control?.setValue(file);
      control?.markAsDirty();
      control?.updateValueAndValidity();
    }
  }

  blockNonNumericChars(event: KeyboardEvent): void {
    if (
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'].includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()))
    ) {
      return;
    } else {
      event.preventDefault();
    }
  }
}