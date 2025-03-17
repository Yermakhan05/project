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
export class CartComponent implements OnInit{
  constructor(private cartService: CartService, private router: Router) {}

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

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Прокрутка в самый верх
      }
    });
  }
}
