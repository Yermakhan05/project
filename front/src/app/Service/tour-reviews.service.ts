import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Review} from '../models';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TourReviewsService{
  private readonly BASE_URL = 'http://127.0.0.1:8000/api/tour';

  constructor(private client: HttpClient) {}

  getList(id: string): Observable<Review[]> {
    return this.client.get<Review[]>(`${this.BASE_URL}/${id}/reviews/`);
  }
  postReview(formData: FormData, id: string): Observable<any> {
    return this.client.post(`${this.BASE_URL}/${id}/reviews/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  }
  updateReview(formData: FormData, id: string, reviewId: string): Observable<any> {
    return this.client.put(`${this.BASE_URL}/${id}/reviews/${reviewId}/`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  }
}
