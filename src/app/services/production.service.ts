import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ProductionStatusType } from '../interfaces/production';

@Injectable({
  providedIn: 'root',
})
export class ProductionService {
  private apiUrl = 'http://localhost:8080/backDonGalleto/api/production';
  private apiUrlRecipes = 'http://localhost:8080/backDonGalleto/api/recipes';

  constructor(private http: HttpClient) {}

  getProductionStatus() {
    return this.http.get<any>(`${this.apiUrl}/status`).pipe(
      map((data) => ({
        preparacion: data.preparacion || [],
        horneado: data.horneado || [],
        enfriamiento: [],
        lista: [],
      }))
    );
  }

  startProduction(cookieId: number) {
    return this.http.post<any>(`${this.apiUrl}/cookies`, { cookieId });
  }

  updateCookieStatus(cookieId: number, newStatus: ProductionStatusType) {
    return this.http.patch(`${this.apiUrl}/cookies/${cookieId}/status`, {
      newStatus,
    });
  }

  completeCookieProduction(cookieId: number) {
    return this.http.post(`${this.apiUrl}/cookies/${cookieId}/complete`, {});
  }

  getRecipe(recipeId: number) {
    return this.http.get<any>(`${this.apiUrlRecipes}/getRecipes/${recipeId}`);
  }
}
