import { Injectable } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  in_stock: boolean;
  images: { url: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = [
    {
      id: 1,
      name: 'Тур в Париж',
      price: 1200,
      quantity: 1,
      in_stock: true,
      images: [{ url: '/assets/tour1.jpeg' }]
    },
    {
      id: 2,
      name: 'Тур в Дубай',
      price: 1500,
      quantity: 2,
      in_stock: true,
      images: [{ url: '/assets/tour2.jpeg' }]
    },
    {
      id: 3,
      name: 'Тур в Мальдивы',
      price: 2500,
      quantity: 1,
      in_stock: true,
      images: [{ url: '/assets/tour3.jpeg' }]
    },
    {
      id: 4,
      name: 'Тур в Стамбул',
      price: 900,
      quantity: 1,
      in_stock: false,
      images: [{ url: '/assets/tour4.jpeg' }]
    },
    {
      id: 5,
      name: 'Тур в Бали',
      price: 2000,
      quantity: 1,
      in_stock: true,
      images: [{ url: '/assets/tour5.jpeg' }]
    }
  ];

  get cartItems(): CartItem[] {
    return this.items;
  }

  increaseQuantity(item: CartItem) {
    item.quantity += 1;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeFromCart(item.id);
    }
  }

  removeFromCart(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clearCart() {
    this.items = [];
  }

  get overallQuantity(): number {
    return this.items.reduce((totalQty, item) => (item.in_stock ? totalQty + item.quantity : totalQty), 0);
  }

  get grandTotal(): number {
    return this.items.reduce((total, item) => (item.in_stock ? total + item.price * item.quantity : total), 0);
  }
}
