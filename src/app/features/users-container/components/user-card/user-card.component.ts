import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToFormGroup, ValidationTooltipDirective } from '../../../../shared';
import { User } from '../../models/user.model';
import { Country } from '../../../../shared/enum/country';
import {
  countryValidator,
  UserNameValidator,
  validateBirthday,
} from '../../../../shared/validators';
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationTooltipDirective],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() form: ToFormGroup<User> = new FormGroup({
    country: new FormControl('', {
      updateOn: 'change',
      validators: [Validators.required, countryValidator()],
    }),
    username: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.userNameValidator.validate.bind(this.userNameValidator)],
      updateOn: 'change',
    }),
    birthday: new FormControl('', {
      updateOn: 'change',
      validators: [Validators.required, validateBirthday()],
    }),
  });

  countries = Object.values(Country);

  constructor(private userNameValidator: UserNameValidator) {}
}
