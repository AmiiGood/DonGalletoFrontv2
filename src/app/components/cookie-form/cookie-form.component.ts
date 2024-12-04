import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cookie } from '../../interfaces/galleta/cookie';
import { CartItem } from '../../interfaces/venta/cart-item';
import { GalletaService } from '../../services/galleta.service';

@Component({
  selector: 'app-cookie-form',
  templateUrl: './cookie-form.component.html',
  styleUrl: './cookie-form.component.css',
})
export class CookieFormComponent implements OnInit {
  @Input() cookies: Cookie[] = [];
  @Output() addToCart = new EventEmitter<CartItem>();
  cookieForm: FormGroup;
  subtotal = 0;
  stockError = '';
  actualUnits = 0;

  constructor(private fb: FormBuilder, private galletaService: GalletaService) {
    this.cookieForm = this.fb.group({
      cookie: ['', Validators.required],
      saleType: ['unit', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.1)]],
    });

    this.cookieForm.get('saleType')?.valueChanges.subscribe(() => {
      this.updateQuantityValidators();
      this.cookieForm.get('quantity')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.updateQuantityValidators();
  }

  private updateQuantityValidators() {
    const saleType = this.cookieForm.get('saleType')?.value;
    const quantityControl = this.cookieForm.get('quantity');

    switch (saleType) {
      case 'unit':
        quantityControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]+$/),
        ]);
        break;
      case 'weight':
      case 'amount':
        quantityControl?.setValidators([
          Validators.required,
          Validators.min(100),
        ]);
        break;
      case 'package500':
      case 'package1000':
        quantityControl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[0-9]+$/),
        ]);
        break;
    }

    if (quantityControl?.value) {
      this.updatePrice();
    }
  }

  get availableCookies() {
    return this.cookies.filter((c) => c.status !== 'Agotado');
  }

  updatePrice() {
    const cookie = this.cookieForm.get('cookie')?.value;
    const saleType = this.cookieForm.get('saleType')?.value;
    const quantity = this.cookieForm.get('quantity')?.value;

    if (!cookie || !quantity) {
      this.subtotal = 0;
      this.actualUnits = 0;
      return;
    }

    switch (saleType) {
      case 'weight':
        this.actualUnits = Math.ceil(quantity / cookie.weightPerUnit);
        this.subtotal = quantity * cookie.price.pricePerGram;
        break;
      case 'amount':
        this.actualUnits = Math.ceil(quantity / cookie.price.unit);
        this.subtotal = quantity;
        break;
      case 'package500':
        this.actualUnits = Math.ceil(500 / cookie.weightPerUnit) * quantity;
        this.subtotal = quantity * cookie.price.package500g;
        break;
      case 'package1000':
        this.actualUnits = Math.ceil(1000 / cookie.weightPerUnit) * quantity;
        this.subtotal = quantity * cookie.price.package1000g;
        break;
      default:
        this.actualUnits = quantity;
        this.subtotal = quantity * cookie.price.unit;
    }

    if (this.actualUnits > cookie.stock) {
      this.stockError = `No hay suficiente stock. Stock disponible: ${cookie.stock} unidades`;
      this.cookieForm.get('quantity')?.setErrors({ insufficientStock: true });
    } else {
      this.stockError = '';
    }
  }

  getQuantityLabel() {
    switch (this.cookieForm.get('saleType')?.value) {
      case 'unit':
        return 'Unidades';
      case 'weight':
        return 'Gramos (min. 100g)';
      case 'package500':
        return 'Paquetes de 500g';
      case 'package1000':
        return 'Paquetes de 1kg';
      case 'amount':
        return 'Monto (min. $100)';
      default:
        return 'Cantidad';
    }
  }

  async submitForm() {
    if (this.cookieForm.valid && !this.stockError) {
      const formValue = this.cookieForm.value;
      try {
        await this.galletaService
          .updateStock(formValue.cookie.id, -this.actualUnits)
          .toPromise();

        this.addToCart.emit({
          cookie: formValue.cookie,
          quantity: formValue.quantity,
          saleType: formValue.saleType,
          subtotal: this.subtotal,
          actualUnits: this.actualUnits,
        });

        this.cookieForm.patchValue({ quantity: 1 });
        this.updatePrice();
      } catch (error) {
        console.error('Error updating stock:', error);
      }
    }
  }

  private calculateUnitsNeeded(
    quantity: number,
    cookie: Cookie,
    saleType: string
  ): number {
    switch (saleType) {
      case 'weight':
        return Math.ceil(quantity / cookie.weightPerUnit);
      case 'amount':
        return Math.ceil(quantity / cookie.price.unit);
      case 'package500':
        return Math.ceil(500 / cookie.weightPerUnit);
      case 'package1000':
        return Math.ceil(1000 / cookie.weightPerUnit);
      default:
        return quantity;
    }
  }
}
