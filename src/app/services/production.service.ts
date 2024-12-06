import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductionStatusType } from '../interfaces/production';

interface AvailabilityResponse {
  available: boolean;
  missingIngredients: {
    ingredientId: number;
    name: string;
    required: number;
    available: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductionService {
  private apiUrl = 'http://localhost:8080/backDonGalleto/api/production';
  private apiUrlRecipes = 'http://localhost:8080/backDonGalleto/api/recipes';

  constructor(private http: HttpClient) {}

  checkIngredientAvailability(
    recipeId: number
  ): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(
      `${this.apiUrlRecipes}/availability/${recipeId}`
    );
  }

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
