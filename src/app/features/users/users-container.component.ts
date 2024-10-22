import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserBulkEditComponent } from './components/user-bulk-form/user-bulk-edit.component';

@Component({
  selector: 'app-users-container',
  standalone: true,
  imports: [CommonModule, UserBulkEditComponent],
  template: `<app-user-bulk-edit></app-user-bulk-edit>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersContainerComponent {}
