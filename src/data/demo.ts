// Datos de las demos. Son inventados: ningún nombre, valor ni fecha
// corresponde a un cliente real, y en pantalla se rotulan como ficticios.

export const stages = ['proposal', 'negotiation', 'won'] as const;
export type Stage = (typeof stages)[number];

export interface Opportunity {
  client: string;
  stage: Stage;
  value: number;
  owner: string;
  date: string;
}

export const opportunities: Opportunity[] = [
  { client: 'Ferretería El Tornillo', stage: 'proposal', value: 18500000, owner: 'L. Rojas', date: '2026-11-20' },
  { client: 'Clínica Santa Aurora', stage: 'negotiation', value: 64200000, owner: 'M. Peña', date: '2026-11-22' },
  { client: 'Transportes Andina', stage: 'won', value: 31800000, owner: 'L. Rojas', date: '2026-11-18' },
  { client: 'Café La Cumbre', stage: 'proposal', value: 7400000, owner: 'D. Mora', date: '2026-11-23' },
  { client: 'Colegio Nuevo Horizonte', stage: 'negotiation', value: 22900000, owner: 'M. Peña', date: '2026-11-15' },
  { client: 'Óptica Mirador', stage: 'won', value: 12600000, owner: 'D. Mora', date: '2026-11-21' },
  { client: 'Distribuidora Sabana', stage: 'proposal', value: 45300000, owner: 'L. Rojas', date: '2026-11-12' },
];

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
