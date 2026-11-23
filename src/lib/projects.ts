import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

export function slugOf(project: Project): string {
  return project.id.split('/').slice(1).join('/');
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection(
    'projects',
    (entry) => entry.id.startsWith(`${lang}/`) && !entry.data.draft,
  );
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function homePath(lang: Lang): string {
  return lang === 'en' ? '/' : '/es/';
}

export function projectPath(lang: Lang, slug: string): string {
  return lang === 'en' ? `/projects/${slug}/` : `/es/projects/${slug}/`;
}

// Ruta equivalente en el otro idioma.
export function switchLangPath(pathname: string, lang: Lang): string {
  if (lang === 'en') return pathname === '/' ? '/es/' : `/es${pathname}`;
  const rest = pathname.replace(/^\/es/, '');
  return rest === '' ? '/' : rest;
}
