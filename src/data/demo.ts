// Datos de las demos. Son inventados: ningún nombre, valor ni fecha
// corresponde a un cliente real, y en pantalla se rotulan como ficticios.

export const roles = ['admin', 'seller', 'auditor'] as const;
export type Role = (typeof roles)[number];

export const modules = ['customers', 'quotes', 'billing', 'users', 'audit'] as const;
export type Module = (typeof modules)[number];

export const actions = ['view', 'create', 'edit', 'delete'] as const;
export type Action = (typeof actions)[number];

// Por rol y módulo, las acciones permitidas.
export const permissions: Record<Role, Record<Module, readonly Action[]>> = {
  admin: {
    customers: ['view', 'create', 'edit', 'delete'],
    quotes: ['view', 'create', 'edit', 'delete'],
    billing: ['view', 'create', 'edit'],
    users: ['view', 'create', 'edit', 'delete'],
    audit: ['view'],
  },
  seller: {
    customers: ['view', 'create', 'edit'],
    quotes: ['view', 'create', 'edit'],
    billing: ['view'],
    users: [],
    audit: [],
  },
  auditor: {
    customers: ['view'],
    quotes: ['view'],
    billing: ['view'],
    users: ['view'],
    audit: ['view'],
  },
};

// El pedido de la demo de cobro. Los nombres de los artículos van en los
// textos de cada idioma, en el mismo orden.
export const cart = [
  { sku: 'AST-M', qty: 1, price: 89900 },
  { sku: 'CAP-N', qty: 2, price: 24900 },
] as const;

// Lo que envía el navegador cuando alguien altera el precio.
export const tamperedTotal = 1000;
