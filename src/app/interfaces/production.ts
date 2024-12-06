export interface CookieProduction {
  id: number;
  cookieId: number;
  name: string;
  description: string;
  unitsProduced: number;
}

export type ProductionStatusType = 'preparacion' | 'horneado' | 'enfriamiento' | 'lista';

export interface ProductionStatus {
  preparacion: CookieProduction[];
  horneado: CookieProduction[];
  enfriamiento: CookieProduction[];
  lista: CookieProduction[];
}