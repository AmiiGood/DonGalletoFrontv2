export interface Cookie {
  id: number;
  name: string;
  description: string;
  status: string;
  price: {
    unit: number;
    package500g: number;
    package1000g: number;
    pricePerGram: number;
  };
  stock: number;
  weightPerUnit: number;
}
