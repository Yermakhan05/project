import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserForm} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  private apiUrl = 'http://localhost:8000/api/forms/';

  constructor(private http: HttpClient) {}

  submitForm(formData: { phone: string; name: string; comment: string; email: string; status: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
