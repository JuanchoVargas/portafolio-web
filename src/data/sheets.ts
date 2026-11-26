// Las hojas de la escena, en orden. La portada es la hoja 01 y va aparte.
// De la posición salen el número de hoja, la letra de detalle y el lado del
// personaje, que alterna para que el contenido ocupe siempre el lado contrario.
import type { Pose } from './poses';

export type SheetId = 'work' | 'demo' | 'security' | 'services' | 'about' | 'contact';

interface SheetDef {
  id: SheetId;
  pose: Pose;
  // Pose que reemplaza a la principal cuando una demo lo pide.
  altPose?: Pose;
}

const defs: SheetDef[] = [
  { id: 'about', pose: 'arms' },
  { id: 'work', pose: 'architect' },
  { id: 'demo', pose: 'desk' },
  { id: 'security', pose: 'shield', altPose: 'keys' },
  { id: 'services', pose: 'build' },
  { id: 'contact', pose: 'paper' },
];

const pad = (n: number) => String(n).padStart(2, '0');

export const sheets = defs.map((def, i) => ({
  ...def,
  number: pad(i + 2),
  letter: String.fromCharCode(65 + i),
  // La portada tiene al personaje a la derecha: la primera hoja lo recibe a la izquierda.
  side: i % 2 === 0 ? ('left' as const) : ('right' as const),
}));

export type Sheet = (typeof sheets)[number];

export const sheetTotal = pad(sheets.length + 1);

export const sheetById = (id: SheetId): Sheet => sheets.find((s) => s.id === id)!;

// Las poses que usa la escena: las de cada hoja, sus alternas y la de caminar.
export const scenePoses: Pose[] = [
  ...new Set<Pose>(sheets.flatMap((s) => (s.altPose ? [s.pose, s.altPose] : [s.pose]))),
  'walk',
];
