import { Component, OnInit } from '@angular/core';
import { Cookie } from '../../interfaces/galleta/cookie';
import { CartItem } from '../../interfaces/venta/cart-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GalletaService } from '../../services/galleta.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cookie-shop',
  templateUrl: './cookie-shop.component.html',
  styleUrl: './cookie-shop.component.css',
})
export class CookieShopComponent implements OnInit {
  cookies: Cookie[] = [];
  cartItems: CartItem[] = [];

  constructor(
    private cookieService: GalletaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCookies();
  }

  loadCookies() {
    this.cookieService.getCookies().subscribe((cookies) => {
      this.cookies = cookies;
    });
  }

  addToCart(item: CartItem) {
    // Check if adding this item would exceed available stock
    const existingItems = this.cartItems.filter(
      (i) => i.cookie.id === item.cookie.id
    );
    const totalUnits =
      existingItems.reduce((sum, i) => sum + i.actualUnits, 0) +
      item.actualUnits;

    if (totalUnits > item.cookie.stock) {
      this.snackBar.open('No hay suficiente stock disponible', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.cartItems.push(item);
    this.snackBar.open('Agregado al carrito!', 'Cerrar', { duration: 2000 });
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  processCheckout() {
    // First create the sale
    const sale = {
      total: this.cartItems.reduce((sum, item) => sum + item.subtotal, 0),
      items: this.cartItems.map((item) => ({
        cookieId: item.cookie.id,
        cookieName: item.cookie.name,
        quantity: item.quantity,
        pricePerUnit: item.subtotal / item.quantity,
        subtotal: item.subtotal,
        saleType: item.saleType,
        actualUnits: item.actualUnits,
      })),
    };

    // Create an array of stock update operations
    const stockUpdates = this.cartItems.map((item) =>
      this.cookieService.updateStock(item.cookie.id, -item.actualUnits)
    );

    this.cookieService.createSale(sale).subscribe({
      next: () => {
        // After sale is created, update all stocks
        forkJoin(stockUpdates).subscribe({
          next: () => {
            this.snackBar.open('Compra realizada con éxito!', 'Cerrar', {
              duration: 3000,
            });
            this.cartItems = [];
            this.loadCookies();
          },
          error: (error) => {
            console.error('Error updating stock:', error);
            this.snackBar.open('Error actualizando el inventario', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      },
      error: () => {
        this.snackBar.open('Error procesando la compra', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
