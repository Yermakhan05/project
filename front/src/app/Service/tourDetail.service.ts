import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tour, TourApiResponse} from "../models";

@Injectable({
  providedIn: 'root'
})
export class TourDetailService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/tour';

  constructor(private client: HttpClient) {}

  getList(id: string): Observable<Tour> {
    return this.client.get<Tour>(`${this.BASE_URL}/${id}/`);
  }
}
