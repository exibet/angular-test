import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckUserResponseData, SubmitFormResponseData } from '../../../shared';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient) {}

  bulkUserUpdate(username: Partial<User>[]): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', { username });
  }

  validateUsername(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }
}
