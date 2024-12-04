import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../interfaces/venta/cart-item';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  @Input() cartItems: CartItem[] = [];
  @Output() removeItem = new EventEmitter<number>();
  @Output() checkout = new EventEmitter<void>();

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getSaleTypeLabel(type: string) {
    switch (type) {
      case 'unit':
        return 'units';
      case 'weight':
        return 'g';
      case 'package500':
        return 'pkg(500g)';
      case 'package1000':
        return 'pkg(1kg)';
      case 'amount':
        return '$';
      default:
        return '';
    }
  }
}
