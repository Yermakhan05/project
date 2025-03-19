import {Component, OnInit} from '@angular/core';
import {CartItem, CartService} from '../Service/CartService';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [
    NgStyle,
    NgClass,
    NgIf,
    NgForOf,
    TranslatePipe
  ],
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []; // 🔹 Локальное хранилище корзины

  constructor(private cartService: CartService, private router: Router) {}

  // 🔹 Получить общее количество товаров
  get overallQuantity(): number {
    return this.cartService.overallQuantity;
  }

  // 🔹 Получить общую сумму заказа
  get grandTotal(): number {
    return this.cartService.grandTotal;
  }

  // 🔹 Загрузить корзину при старте
  ngOnInit(): void {
    this.cartService.fetchCart().subscribe((items) => {
      this.cartItems = items;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Прокрутка вверх при навигации
      }
    });
  }

  // 🔹 Увеличить количество
  increaseQuantity(item: CartItem) {
    this.cartService.increaseQuantity(item);
  }

  // 🔹 Уменьшить количество
  decreaseQuantity(item: CartItem) {
    this.cartService.decreaseQuantity(item);
  }

  // 🔹 Удалить товар
  removeFromCart(id: number) {
    this.cartService.removeFromCart(id).subscribe(() => {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
    });
  }

  // 🔹 Купить товары (оформить заказ)
  buyItems() {
    if (this.cartItems.length === 0) {
      alert('Ваша корзина пуста!');
    } else {
      this.cartService.checkoutCart().subscribe(() => {
        this.cartItems = []; // Очищаем корзину
        alert('Ваш заказ оформлен!');
      });
    }
  }
}
