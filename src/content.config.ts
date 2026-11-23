import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada proyecto es un archivo Markdown en src/content/projects/<idioma>/<slug>.md.
// Para agregar uno: crear el archivo en en/ y en es/ con el mismo nombre.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string().max(110),
      kind: z.enum(['source', 'case-study']),
      status: z.string(),
      year: z.string().optional(),
      order: z.number(),
      stack: z.array(z.string()).min(1),
      repo: z.url().optional(),
      live: z.url().optional(),
      cover: image().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      highlights: z.array(z.string()).default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
