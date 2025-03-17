import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Booking, Review, Tour, TourApiResponse, UserProfile} from "../models";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/';

  constructor(private client: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this.client.get<UserProfile>(`${this.BASE_URL}user-profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
  }
  updateProfile(profileData: any): Observable<any> {
    const formData = new FormData();
    for (const key in profileData) {
      if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    }
    return this.client.put<any>(this.BASE_URL+"profile/update/", formData, {
      headers: this.getAuthHeaders(false)  // Не передаем `Content-Type`, так как `FormData` устанавливает его автоматически
    });
  }

  private getAuthHeaders(includeJson: boolean = true): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (includeJson) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }
  getUserBookingHistory(): Observable<Booking[]> {
    return this.client.get<Booking[]>(`${this.BASE_URL}user-booking-history/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
  }
  getUserReviews(): Observable<Review[]> {
    return this.client.get<Review[]>(`${this.BASE_URL}user-reviews/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
  }
}
