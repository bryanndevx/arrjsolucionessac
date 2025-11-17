/**
 * Tipos relacionados con productos
 */

export type ProductType = 'rent' | 'sale';

export interface Product {
  id: string;
  name: string;
  price: number;
  pricePerDay?: number; // Para alquileres
  images?: string[];
  badge?: string;
  short?: string;
  description?: string;
  type?: ProductType;
}
