import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  materialOptions = [
    { label: 'Bones', value: 'bones' },
    { label: 'Ruins', value: 'ruins' },
    { label: 'Writing', value: 'writing' }
  ];

  welcomeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.welcomeForm = this.fb.group({
      newUser: ['', Validators.required],
      materials: this.fb.array([], { validators: minMaxSelected(1, 3) })
    });
  }

  get materials(): FormArray {
    return this.welcomeForm.get('materials') as FormArray;
  }

  onMaterialToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const arr = this.materials;

    if (checkbox.checked) {
      arr.push(new FormControl(checkbox.value));
    } else {
      const idx = arr.controls.findIndex(ctrl => ctrl.value === checkbox.value);
      if (idx !== -1) { arr.removeAt(idx); }
    }
    arr.updateValueAndValidity();
  }

  submit(): void {
    console.log(this.welcomeForm.value);
  }
}

function minMaxSelected(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }
    const count = control.length;
    return count >= min && count <= max ? null : { rangeError: true };
  };
}