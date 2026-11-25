// Los nodos que flotan en cada zona: tecnologías y conceptos unidos con líneas,
// como un diagrama de arquitectura. Las tecnologías salen de tech.ts, con su
// logo y su color de marca; los conceptos son fichas de texto.
import { tech, type Tech, type TechId } from './tech';

export interface FloatNode extends Partial<Pick<Tech, 'hex' | 'icon'>> {
  label: string;
  text?: string;
  // Posición dentro de la zona, en porcentaje.
  x: number;
  y: number;
  // Índices de los nodos con los que se une.
  links?: number[];
}

const node = (id: TechId, x: number, y: number, links?: number[]): FloatNode => {
  const t: Tech = tech[id];
  return { label: t.name, icon: t.icon, text: t.text, hex: t.hex, x, y, links };
};
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
    node('dotnet', 8, 13, [1, 3]),
    node('vue', 90, 13, [2]),
    node('typescript', 93, 46, [5]),
    node('sqlserver', 7, 52, [4]),
    node('postgresql', 12, 84),
    node('react', 90, 80),
  ],
  work: [
    node('vue', 14, 7, [1]),
    node('nuxt', 50, 4, [2]),
    node('dotnet', 86, 9, [3]),
    node('vercel', 88, 33),
    node('powershell', 8, 30, [0]),
  ],
  demo: [
    node('vue', 16, 6, [1]),
    node('mercadopago', 52, 4, [2]),
    chip('webhook', 'Signed webhook', 84, 9, [3]),
    node('typescript', 88, 30),
    chip('chat', 'Sales bot', 9, 27, [0]),
  ],
  security: [
    node('jwt', 14, 7, [1]),
    chip('403', 'HTTP 403', 50, 4, [2]),
    node('owasp', 86, 9, [3]),
    chip('RBAC', 'Role-based access', 88, 32),
    chip('hash', 'Password hashing', 8, 30, [0]),
  ],
  services: [
    node('dotnet', 16, 7, [1]),
    node('xunit', 50, 4, [2]),
    node('playwright', 85, 9, [3]),
    node('vercel', 88, 31),
    node('iis', 8, 29, [0]),
  ],
  about: [node('typescript', 15, 8, [1]), node('postgresql', 50, 4, [2]), node('react', 85, 9)],
} satisfies Record<string, FloatNode[]>;

export type FloatSet = keyof typeof floatSets;
