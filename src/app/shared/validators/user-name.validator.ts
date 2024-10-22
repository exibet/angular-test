import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { UserApiService } from '../../features/users/services/user-api.service';
@Injectable({
  providedIn: 'root',
})
export class UserNameValidator implements AsyncValidator {
  constructor(private userApiService: UserApiService) {}
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of({ unavailable: true });
    }

    return this.userApiService.validateUsername(control.value).pipe(
      map((response) => {
        return response.isAvailable ? null : { unavailable: true };
      }),
      catchError(() => of(null))
    );
  }
}
