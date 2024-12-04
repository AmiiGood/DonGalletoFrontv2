import { Cookie } from '../galleta/cookie';

export interface CartItem {
  cookie: Cookie;
  quantity: number;
  saleType: string;
  subtotal: number;
  actualUnits: number;
}

export interface SaleItem {
  cookieId: number;
  cookieName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  saleType: string;
  actualUnits: number;
}
