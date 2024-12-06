import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../interfaces/venta/cart-item';
import { GalletaService } from '../../services/galleta.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  @Input() cartItems: CartItem[] = [];
  @Output() removeItem = new EventEmitter<number>();
  @Output() checkout = new EventEmitter<void>();

  constructor(private galletaService: GalletaService) {}

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getSaleTypeLabel(type: string) {
    switch (type) {
      case 'unit':
        return 'units';
      case 'weight':
        return 'g';
      case 'package_500':
        return 'pkg(500g)';
      case 'package_1000':
        return 'pkg(1kg)';
      case 'amount':
        return '$';
      default:
        return '';
    }
  }

  handleCheckout() {
    const updatePromises = this.cartItems.map((item) => {
      if (item.actualUnits === item.cookie.stock) {
        console.log(
          `Attempting to update status for cookie ${item.cookie.id}:`,
          item.cookie
        );

        return new Promise((resolve, reject) => {
          this.galletaService
            .updateCookieStatus(item.cookie.id, 'Agotado')
            .subscribe({
              next: (response) => {
                console.log(
                  `Successfully updated cookie ${item.cookie.name}:`,
                  response
                );
                resolve(response);
              },
              error: (error: HttpErrorResponse) => {
                console.error('Detailed error:', {
                  status: error.status,
                  statusText: error.statusText,
                  message: error.message,
                  error: error.error,
                });
                reject(error);
              },
            });
        });
      }
      return Promise.resolve();
    });

    // Wait for all updates to complete
    Promise.all(updatePromises)
      .then(() => {
        console.log('All status updates completed successfully');
        this.checkout.emit();
      })
      .catch((error) => {
        console.error('Error during checkout process:', error);
        // Aquí podrías agregar un mensaje de error para el usuario
        // Por ejemplo, usando MatSnackBar o un servicio de notificaciones
      });
  }
}
