import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortalService } from '../services/portal.service';

@Component({
  selector: 'app-merchant-register',
  templateUrl: './merchant-register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})

export class MerchantRegisterComponent implements OnInit {
  form!: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder, private portal: PortalService) { }

  ngOnInit(): void {
    this.form = this.fb.group({

      // Merchant Information
      businessRegNo: ['', Validators.required],
      companyName: ['', Validators.required],
      incorporationDate: ['', Validators.required],
      countryOfCorp: ['', Validators.required],
      merchantNameEn: ['', Validators.required],
      merchantNameLocal: ['', Validators.required],
      taxId: ['', Validators.required],
      entityType: ['', Validators.required],

      // Merchant Address
      address1: ['', Validators.required],
      address2: [''],
      address3: [''],
      address4: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{4,10}$') // 4 to 10 numbers only
      ]],
      country: ['', Validators.required],
      phone1: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$') // Numbers only
      ]],
      phone2: ['', Validators.pattern('^[0-9]+$')],

      // Owner Profile
      ownerFirstName: ['', Validators.required],
      ownerLastName: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerDob: ['', Validators.required],
      ownerIdNo: ['', Validators.required],
      ownerNationality: ['', Validators.required],
      ownerIdFront: [null, Validators.required],
      ownerIdBack: [null, Validators.required],

      // Merchant Business
      industry: ['', Validators.required],
      businessType: ['', Validators.required],
      numEmployees: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$') // Numbers only
      ]],
      schemeRequired: ['', Validators.required],
      facilityRequired: ['', Validators.required],
      proofOfBusiness: [null, Validators.required],
    });
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) {
      return false;
    }
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

  submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    console.error('Form is invalid. Please check all fields.');
    return;
  }
  this.submitting = true;
  const formData = new FormData();
  const formValues = this.form.getRawValue();

  Object.keys(formValues).forEach(key => {
    formData.append(key, formValues[key]);
  });

  this.portal.submitApplication(formData).subscribe({
    next: (res) => {
      this.submitting = false;
      console.log('Submission successful!', res);
      
      alert(`Application submitted successfully!\nYour Reference ID is: ${res.referenceId}`);
      this.form.reset();
    },
    error: (err) => {
      this.submitting = false;
      console.error('Submission failed:', err);
      alert('Submission failed. Please try again.');
    },
  });
}

  blockNonNumericChars(event: KeyboardEvent): void {
    if (
      [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'
      ].includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()))
    ) {
      return;
    } else {
      event.preventDefault();
    }
  }
}