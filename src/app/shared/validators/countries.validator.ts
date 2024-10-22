import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Country } from '../enum/country';

export const countryValidator = () => {
  return (control: AbstractControl): ValidationErrors | null => {
    const countries = Object.values(Country);

    if (!control.value) {
      return null;
    }
    return countries.includes(control.value) ? null : { invalidCountry: true };
  };
};
