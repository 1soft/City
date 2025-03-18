
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class FormValidators {
  // ✅ Required Field Validator
  static required = Validators.required;

  // ✅ Email Validator
  static email = Validators.email;

  // ✅ Strong Password Validator
  static strongPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) {
      return { required: true };
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&])[A-Za-z\d$#@$!%*?&]{8,}$/;
    return regex.test(password) ? null : { strongPassword: true };
  };

  // ✅ Custom Min Length Validator
  static minLength(length: number): ValidatorFn {
    return Validators.minLength(length);
  }

  // ✅ Custom Max Length Validator
  static maxLength(length: number): ValidatorFn {
    return Validators.maxLength(length);
  }

  // ✅ Match Passwords Validator (Confirm Password)
  static matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordKey)?.value;
      const confirmPassword = control.get(confirmPasswordKey)?.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
}
