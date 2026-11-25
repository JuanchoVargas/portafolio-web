// Datos y reglas de la demo de agenda. Todo es inventado: ningún nombre,
// servicio ni cifra corresponde a una clínica o a un paciente real, y en
// pantalla se rotula como ficticio. Los nombres de servicios e insumos van en
// los textos de cada idioma (src/i18n/demo-agenda.ts).

export const SLOT_MIN = 30; // minutos de cada franja
export const OPEN_MIN = 9 * 60; // la sede abre a las 9:00
export const SLOTS = 8; // franjas del día: la sede cierra a la 1:00 p. m.

export const supplies = ['mask', 'acid', 'gel'] as const;
export type Supply = (typeof supplies)[number];

// Existencia inicial y mínimo de cada insumo.
export const stockStart: Record<Supply, { stock: number; min: number }> = {
  mask: { stock: 4, min: 3 },
  acid: { stock: 3, min: 2 },
  gel: { stock: 5, min: 4 },
};

export const services = ['facial', 'peel', 'laser'] as const;
export type Service = (typeof services)[number];

// Por servicio: cuántas franjas dura y qué insumo gasta al atenderse.
export const serviceInfo: Record<Service, { slots: number; supply: Supply; qty: number }> = {
  facial: { slots: 1, supply: 'mask', qty: 1 },
  peel: { slots: 2, supply: 'acid', qty: 1 },
  laser: { slots: 3, supply: 'gel', qty: 2 },
};

export const pros = ['L. Vega', 'S. Marín'] as const;

export interface Appointment {
  id: number;
  pro: number; // índice en `pros`
  start: number; // índice de la franja en la que empieza
  service: Service;
  patient: string;
  done: boolean;
}

// Las citas con las que arranca el día.
export const dayStart: Appointment[] = [
  { id: 1, pro: 0, start: 0, service: 'peel', patient: 'A. Ríos', done: false },
  { id: 2, pro: 0, start: 4, service: 'facial', patient: 'N. Pardo', done: false },
  { id: 3, pro: 1, start: 1, service: 'laser', patient: 'T. Lozano', done: false },
  { id: 4, pro: 1, start: 6, service: 'facial', patient: 'E. Quiroga', done: false },
];

// Pacientes para las citas que reserva el visitante, en orden.
export const walkIns = ['C. Duarte', 'P. Luna', 'M. Ortiz', 'J. Cano', 'R. Salas', 'V. Niño'];

export const endOf = (a: Pick<Appointment, 'start' | 'service'>) => a.start + serviceInfo[a.service].slots;

// La hora de una franja, en formato de 24 horas.
export function timeOf(slot: number): string {
  const min = OPEN_MIN + slot * SLOT_MIN;
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
}

export type SlotCheck = 'ok' | 'busy' | 'closed';

// Lo que revisa el servidor antes de reservar: que la cita quepa completa en
// el horario de la sede y que no se cruce con otra del mismo profesional.
export function checkSlot(day: Appointment[], pro: number, start: number, service: Service): SlotCheck {
  const end = start + serviceInfo[service].slots;
  if (end > SLOTS) return 'closed';
  const clash = day.some((a) => a.pro === pro && a.start < end && start < endOf(a));
  return clash ? 'busy' : 'ok';
}

// Las franjas libres de un profesional.
export function freeSlots(day: Appointment[], pro: number): number[] {
  const free: number[] = [];
  for (let slot = 0; slot < SLOTS; slot++) {
    if (!day.some((a) => a.pro === pro && a.start <= slot && slot < endOf(a))) free.push(slot);
  }
  return free;
}

// Porcentaje de franjas ocupadas entre todos los profesionales.
export function occupancy(day: Appointment[]): number {
  const used = day.reduce((sum, a) => sum + serviceInfo[a.service].slots, 0);
  return Math.round((used / (SLOTS * pros.length)) * 100);
}
