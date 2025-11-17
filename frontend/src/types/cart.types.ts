/**
 * Tipos relacionados con el carrito de compras
 */

import type { Product } from './product.types';

export interface CartItem extends Product {
  quantity: number;
}

export interface QuoteFormData {
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  comentarios: string;
}
