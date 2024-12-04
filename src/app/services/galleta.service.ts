import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cookie } from '../interfaces/galleta/cookie';
import { SaleItem } from '../interfaces/venta/cart-item';

@Injectable({
  providedIn: 'root',
})
export class GalletaService {
  private apiUrl = 'http://localhost:8080/backDonGalleto/api/';

  constructor(private http: HttpClient) {}

  getCookies(): Observable<Cookie[]> {
    return this.http
      .get<any>(`${this.apiUrl}cookie/getCookies`)
      .pipe(map((response) => response.cookies));
  }

  getCookiesBoolean(showAll: boolean): Observable<any> {
    const endpoint = showAll ? 'getCookiesPublicTodos' : 'getCookies';
    return this.http.get(`${this.apiUrl}cookie/${endpoint}`);
  }

  validateSale(
    cookieId: number,
    quantity: number,
    saleType: string
  ): Observable<any> {
    return this.http.get(`${this.apiUrl}sale/validate`, {
      params: { cookieId, quantity, saleType },
    });
  }

  createSale(sale: { total: number; items: SaleItem[] }): Observable<any> {
    console.log(sale);
    return this.http.post(`${this.apiUrl}sale/createSale`, sale);
  }

  updateStock(cookieId: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}cookie/${cookieId}/stock`, {
      quantity,
    });
  }
}
