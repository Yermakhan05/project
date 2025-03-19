import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Tour} from '../models';

export interface CartItem {
  id: number;
  tour: Tour; // ID тура
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:8000/api/cart/';
  private items: CartItem[] = [];

  constructor(private http: HttpClient) {}

  // 🔹 Получение заголовков с токеном
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    });
  }

  // 🔹 Получить содержимое корзины с сервера
  fetchCart(): Observable<CartItem[]> {
    return new Observable((observer) => {
      this.http
        .get<CartItem[]>(this.apiUrl, { headers: this.getHeaders() }) // 👈 Добавляем headers
        .subscribe((data) => {
          this.items = data;
          observer.next(this.items);
          observer.complete();
        });
    });
  }

  // 🔹 Добавить товар в корзину
  addToCart(tourId: number, quantity: number = 1): Observable<CartItem> {
    return new Observable((observer) => {
      this.http
        .post<CartItem>(this.apiUrl, { tour: tourId, quantity }, { headers: this.getHeaders() })
        .subscribe((newItem) => {
          this.items.push(newItem);
          observer.next(newItem);
          observer.complete();
        });
    });
  }

  // 🔹 Увеличить количество
  increaseQuantity(item: CartItem) {
    item.quantity += 1; // Увеличиваем локально
    this.updateQuantity(item, item.quantity).subscribe();
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) { // Предотвращаем уход в отрицательные значения
      item.quantity -= 1;
      this.updateQuantity(item, item.quantity).subscribe();
    }
  }

  // 🔹 Обновить количество на сервере
  updateQuantity(item: CartItem, newQuantity: number): Observable<CartItem> {
    let cartId = item.id.toString()
    return new Observable((observer) => {
      this.http
        .put<CartItem>(`${this.apiUrl}${cartId}/`, { quantity: newQuantity }, { headers: this.getHeaders() })
        .subscribe((updatedItem) => {
          item.quantity = updatedItem.quantity;
          observer.next(updatedItem);
          observer.complete();
        });
    });
  }

  // 🔹 Удалить из корзины
  removeFromCart(id: number): Observable<void> {
    return new Observable((observer) => {
      this.http
        .delete(`${this.apiUrl}${id}/`, { headers: this.getHeaders() }) // 👈 Добавили headers
        .subscribe(() => {
          this.items = this.items.filter((item) => item.id !== id);
          observer.next();
          observer.complete();
        });
    });
  }

  // 🔹 Очистить корзину (после оформления заказа)
  clearCart(): void {
    this.items = [];
  }

  // 🔹 Оформить заказ (Checkout)
  checkoutCart(): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post(`${this.apiUrl}checkout/`, {}, { headers: this.getHeaders() }) // 👈 Добавили headers
        .subscribe((response) => {
          this.clearCart();
          observer.next(response);
          observer.complete();
        });
    });
  }

  get overallQuantity(): number {
    return this.items.reduce((totalQty, item) => totalQty + item.quantity, 0);
  }

  get grandTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.tour.price * item.quantity,
      0
    );
  }
}
