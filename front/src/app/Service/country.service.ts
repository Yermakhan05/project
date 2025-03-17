import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Country} from "../models";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  BASE_URL = 'http://127.0.0.1:8000'
  constructor(private client: HttpClient) {
  }
  getList(params: any = {}): Observable<Country[]> {
    return this.client.get<Country[]>('http://127.0.0.1:8000/api/countries/', { params });
  }
}
