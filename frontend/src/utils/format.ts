/**
 * Funciones utilitarias para formateo
 */

/**
 * Formatea un número como moneda peruana (Soles)
 */
export const formatCurrency = (amount: number): string => {
  return `S/ ${amount.toLocaleString('es-PE')}`;
};

/**
 * Formatea un precio por día
 */
export const formatDailyPrice = (pricePerDay: number): string => {
  return `Desde ${formatCurrency(pricePerDay)} por día`;
};
