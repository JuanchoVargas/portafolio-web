// Datos y cuentas de la demo de cotización. Todo es inventado: ningún cliente,
// producto ni precio corresponde a un negocio real. Los nombres de productos y
// de listas de precios van en los textos de cada idioma, en el mismo orden.

export const priceLists = ['general', 'wholesale', 'distributor'] as const;
export type PriceList = (typeof priceLists)[number];

// Lo que cobra cada lista sobre el precio base.
const factor: Record<PriceList, number> = { general: 1, wholesale: 0.9, distributor: 0.82 };

export interface QuoteCustomer {
  name: string;
  list: PriceList;
}

// Cada cliente tiene su lista de precios: al cambiar de cliente cambian los precios.
export const quoteCustomers: QuoteCustomer[] = [
  { name: 'Ferretería El Tornillo', list: 'general' },
  { name: 'Distribuidora Sabana', list: 'wholesale' },
  { name: 'Transportes Andina', list: 'distributor' },
];

// Precio base de cada producto, en pesos.
export const quoteProducts = [
  { sku: 'TAL-650', base: 189000 },
  { sku: 'PIN-GAL', base: 68900 },
  { sku: 'TOR-100', base: 12500 },
  { sku: 'GUA-PAR', base: 9800 },
] as const;

export const discounts = [0, 5, 10] as const;
export type Discount = (typeof discounts)[number];

export const quoteStates = ['draft', 'sent', 'approved'] as const;
export type QuoteState = (typeof quoteStates)[number];

const round = (n: number) => Math.round(n / 100) * 100;

// Precio de lista de un producto para un cliente.
export const listPrice = (product: number, customer: QuoteCustomer) =>
  round(quoteProducts[product].base * factor[customer.list]);

export interface QuoteLine {
  product: number;
  qty: number;
  // Precio de lista y precio cobrado por unidad: la diferencia es el descuento.
  list: number;
  unit: number;
  total: number;
}

export interface QuoteTotals {
  lines: QuoteLine[];
  subtotal: number; // a precio de lista
  discount: number;
  total: number;
}

// Renglones y totales de una cotización. `qty` trae la cantidad por producto.
export function quoteTotals(qty: readonly number[], customer: QuoteCustomer, discount: Discount): QuoteTotals {
  const lines = qty.flatMap((n, product) => {
    if (n <= 0) return [];
    const list = listPrice(product, customer);
    const unit = round(list * (1 - discount / 100));
    return [{ product, qty: n, list, unit, total: unit * n }];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.list * l.qty, 0);
  const total = lines.reduce((sum, l) => sum + l.total, 0);
  return { lines, subtotal, discount: subtotal - total, total };
}

export const MAX_QTY = 99;
