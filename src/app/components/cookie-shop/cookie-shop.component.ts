import { Component, OnInit } from '@angular/core';
import { Cookie } from '../../interfaces/galleta/cookie';
import { CartItem } from '../../interfaces/venta/cart-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GalletaService } from '../../services/galleta.service';

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
    this.cartItems.push(item);
    this.snackBar.open('Agregado al carrito!', 'Cerrar', { duration: 2000 });
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  processCheckout() {
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

    this.cookieService.createSale(sale).subscribe({
      next: () => {
        this.snackBar.open('Compra realizada con éxito!', 'Cerrar', { duration: 3000 });
        this.cartItems = [];
        this.loadCookies();
      },
      error: () => {
        this.snackBar.open('Error procesando la compra', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
