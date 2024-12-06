import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
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

  updateCookieStatus(cookieId: number, status: string): Observable<any> {
    const url = `${this.apiUrl}cookie/${cookieId}/status`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log(`Sending PATCH request to ${url} with status: ${status}`);

    return this.http.patch(url, { status }, { headers }).pipe(
      tap((response) => console.log('Server response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Client side error:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(() => error);
  }
}
