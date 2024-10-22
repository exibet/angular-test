import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, EventEmitter } from '@angular/core';
import { UserCardComponent } from '../user-card/user-card.component';
import { FormArray, FormControlStatus, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserNameValidator } from '../../../../shared/validators';
import { SubmitFormResponseData, ToFormGroup } from '../../../../shared';
import { UserApiService } from '../../services/user-api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  filter,
  Observable,
  skip,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

type BulkUserForm = FormArray<ToFormGroup<User>>;

@UntilDestroy()
@Component({
  selector: 'app-user-bulk-edit',
  standalone: true,
  imports: [CommonModule, UserCardComponent, ReactiveFormsModule],
  templateUrl: './user-bulk-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBulkEditComponent implements OnInit {
  timerCount = 5;
  isShowCancelBtn = false;
  isShowErrorCount = false;

  private canceleSubject = new Subject<void>();

  private timerSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.timerCount);
  timer$: Observable<number> = this.timerSubject.asObservable();

  constructor(
    private userNameValidator: UserNameValidator,
    private userApiService: UserApiService
  ) {}

  formArray: BulkUserForm = new FormArray<ToFormGroup<User>>([]);

  ngOnInit(): void {
    this.onAddUserForm();
    this.formValidStatusChanges().subscribe(() => (this.isShowErrorCount = false));
  }

  onAddUserForm(): void {
    const userForm = new UserCardComponent(this.userNameValidator)?.form;
    if (!userForm) {
      return;
    }
    this.formArray.push(userForm);
  }

  onRemoveUserForm(index: number): void {
    this.formArray.removeAt(index);
  }

  onSubmit(): void {
    const isValid: boolean = this.validateAllFormFields(this.formArray);

    if (!isValid) {
      this.isShowErrorCount = true;
      return;
    }

    this.formArray.disable();
    this.toggleShowCancelBtn();
    this.starTimer()
      .pipe(
        switchMap(() => this.createUsers(this.formArray.getRawValue())),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.onCancel();
        this.formReset();
      });
  }

  onCancel(): void {
    this.timerSubject.next(this.timerCount);
    this.canceleSubject.next();
    this.toggleShowCancelBtn();
    this.formArray.enable();
  }

  //Definitely not the best solution, but for this purpose I hope it's ok
  //Better to use PIPE or memoize result
  getInvalidFormsCount(): number {
    return (this.formArray.controls || []).filter(
      (control) => control.invalid || control.status === 'PENDING'
    ).length;
  }

  private toggleShowCancelBtn() {
    this.isShowCancelBtn = !this.isShowCancelBtn;
  }

  private createUsers(data: User[]): Observable<SubmitFormResponseData> {
    return this.userApiService.bulkUserUpdate(data);
  }

  private starTimer(): Observable<number> {
    return timer(5, 1000).pipe(
      skip(1),
      take(this.timerCount),
      tap((val) => this.timerSubject.next(this.timerCount - val)),
      filter((val) => val === this.timerCount),
      takeUntil(this.canceleSubject.asObservable())
    );
  }

  //To trigger validations on all controls after submission.
  //Definitely not the best solution, but for this purpose I hope it's ok
  private validateAllFormFields(formArray: FormArray<FormGroup>): boolean {
    formArray.controls.forEach((group: FormGroup) => {
      Object.values(group.controls).forEach((control) => {
        (<EventEmitter<unknown>>control.statusChanges).emit(control.status);
      });
    });

    return formArray.valid;
  }

  private formValidStatusChanges(): Observable<FormControlStatus> {
    return this.formArray.statusChanges.pipe(
      filter((status: FormControlStatus) => status === 'VALID'),
      untilDestroyed(this)
    );
  }

  private formReset(): void {
    this.formArray.reset();
    this.formArray.clear();
    this.onAddUserForm();
  }
}
