import { FormControl, FormGroup } from '@angular/forms';

export type ToFormControl<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export type ToFormGroup<T> = FormGroup<ToFormControl<T>>;
