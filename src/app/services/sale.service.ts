import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = 'http://localhost:8080/backDonGalleto/api/sale';

  constructor(private http: HttpClient) {}

  getAllSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllSales`);
  }
}
