// Las tecnologías que aparecen en el sitio, con su logo y su color de marca.
// Solo se usa en el servidor, al construir: de cada ícono sale un trazo SVG
// que va en línea en la página. Las que no tienen logo libre van como sigla.
import {
  siDotnet,
  siJsonwebtokens,
  siMercadopago,
  siNuxt,
  siOwasp,
  siPostgresql,
  siReact,
  siTypescript,
  siVercel,
  siVuedotjs,
  siWoo,
} from 'simple-icons';

export interface Tech {
  name: string;
  // Color de marca, sin el numeral.
  hex: string;
  // Trazo del logo (caja de 24 × 24). Sin logo se muestra `text`.
  icon?: string;
  text?: string;
}

const logo = (i: { title: string; path: string; hex: string }, name = i.title): Tech => ({
  name,
  hex: i.hex,
  icon: i.path,
});
const sigla = (text: string, name: string, hex: string): Tech => ({ name, hex, text });

export const tech = {
  dotnet: logo(siDotnet, '.NET'),
  aspnet: logo(siDotnet, 'ASP.NET Core'),
  efcore: sigla('EF', 'Entity Framework Core', '512BD4'),
  sqlserver: sigla('SQL', 'SQL Server', 'CC2927'),
  postgresql: logo(siPostgresql),
  vue: logo(siVuedotjs, 'Vue 3'),
  nuxt: logo(siNuxt),
  react: logo(siReact),
  typescript: logo(siTypescript),
  powershell: sigla('PS>', 'PowerShell', '2E6FD9'),
  xunit: sigla('xU', 'xUnit', '7B3FB5'),
  playwright: sigla('e2e', 'Playwright', '2EAD33'),
  iis: sigla('IIS', 'IIS', '0078D4'),
  vercel: logo(siVercel),
  jwt: logo(siJsonwebtokens, 'JWT'),
  owasp: logo(siOwasp),
  mercadopago: logo(siMercadopago),
  woo: logo(siWoo, 'WooCommerce'),
} satisfies Record<string, Tech>;

export type TechId = keyof typeof tech;

// Las herramientas del perfil, en el orden en que se muestran.
export const stack: TechId[] = [
  'dotnet',
  'aspnet',
  'efcore',
  'sqlserver',
  'postgresql',
  'vue',
  'nuxt',
  'react',
  'typescript',
  'powershell',
  'xunit',
  'playwright',
  'iis',
  'vercel',
  'jwt',
  'owasp',
];
