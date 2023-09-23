import { AbstractControl, ValidationErrors } from '@angular/forms';

export function   validatePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#])[a-zA-Z0-9!@#]{8}$/;
  
    if (password && !regex.test(password)) {
      return { invalidPassword: true };
    }
  
    return null;
  }