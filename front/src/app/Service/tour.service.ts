import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tour, TourApiResponse} from "../models";

@Injectable({
  providedIn: 'root'
})
export class TourService {
  BASE_URL = 'http://127.0.0.1:8000'
  constructor(private client: HttpClient) {
  }
  getList(params: any = {}): Observable<TourApiResponse>{
    return this.client.get<TourApiResponse>(`${this.BASE_URL}/api/tours/`, { params })
  }
}
