import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const validateBirthday = (): ValidatorFn  => {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const birthday = new Date(control.value);

      return birthday > today ? { invalidDate: true } : null;
    };
  }