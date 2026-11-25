// Los nodos que flotan en cada zona: tecnologías y conceptos unidos con líneas,
// como un diagrama de arquitectura. Solo se usan en el servidor, al construir:
// de cada ícono sale un trazo SVG que va en línea en la página.
import {
  siDotnet,
  siJsonwebtokens,
  siNuxt,
  siOwasp,
  siPostgresql,
  siReact,
  siTypescript,
  siVercel,
  siVuedotjs,
} from 'simple-icons';

export interface FloatNode {
  label: string;
  // Trazo del ícono (caja de 24 × 24). Sin ícono, el nodo es una ficha con `text`.
  icon?: string;
  text?: string;
  // Posición dentro de la zona, en porcentaje.
  x: number;
  y: number;
  // Índices de los nodos con los que se une.
  links?: number[];
}

const icon = (i: { title: string; path: string }, x: number, y: number, links?: number[]): FloatNode => ({
  label: i.title,
  icon: i.path,
  x,
  y,
  links,
});
const chip = (text: string, label: string, x: number, y: number, links?: number[]): FloatNode => ({
  label,
  text,
  x,
  y,
  links,
});

// Los rótulos son términos técnicos: sirven igual en inglés y en español.
// Los nodos van en la periferia de la zona: el centro lo ocupa el personaje.
export const floatSets = {
  hero: [
    icon(siDotnet, 8, 13, [1, 3]),
    icon(siVuedotjs, 90, 13, [2]),
    icon(siTypescript, 93, 46, [5]),
    chip('SQL', 'SQL Server', 7, 52, [4]),
    icon(siPostgresql, 12, 84),
    icon(siReact, 90, 80),
  ],
  work: [
    icon(siVuedotjs, 14, 7, [1]),
    icon(siNuxt, 50, 4, [2]),
    icon(siDotnet, 86, 9, [3]),
    icon(siVercel, 88, 33),
    chip('PS>', 'PowerShell', 8, 30, [0]),
  ],
  demo: [
    chip('ref()', 'Vue ref', 16, 6, [1]),
    icon(siVuedotjs, 52, 4, [2]),
    chip('computed', 'Vue computed', 84, 9, [3]),
    icon(siTypescript, 88, 30),
    chip('v-model', 'Vue v-model', 9, 27, [0]),
  ],
  security: [
    icon(siJsonwebtokens, 14, 7, [1]),
    chip('403', 'HTTP 403', 50, 4, [2]),
    icon(siOwasp, 86, 9, [3]),
    chip('RBAC', 'Role-based access', 88, 32),
    chip('hash', 'Password hashing', 8, 30, [0]),
  ],
  services: [
    icon(siDotnet, 16, 7, [1]),
    chip('xUnit', 'xUnit', 50, 4, [2]),
    chip('e2e', 'Playwright', 85, 9, [3]),
    icon(siVercel, 88, 31),
    chip('IIS', 'IIS', 8, 29, [0]),
  ],
  about: [
    icon(siTypescript, 15, 8, [1]),
    icon(siPostgresql, 50, 4, [2]),
    icon(siReact, 85, 9),
  ],
} satisfies Record<string, FloatNode[]>;

export type FloatSet = keyof typeof floatSets;
