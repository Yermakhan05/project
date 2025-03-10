import { Component } from '@angular/core';
import {CartItem, CartService} from '../Service/CartService';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [
    NgStyle,
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrl: './cart.component.css'
})
export class CartComponent {
  constructor(private cartService: CartService) {}

  get cartItems(): CartItem[] {
    return this.cartService.cartItems;
  }

  get overallQuantity(): number {
    return this.cartService.overallQuantity;
  }

  get grandTotal(): number {
    return this.cartService.grandTotal;
  }

  increaseQuantity(item: CartItem) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.decreaseQuantity(item);
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
  }

  buyItems() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      this.cartService.clearCart();
      alert('You bought the items');
    }
  }
}
