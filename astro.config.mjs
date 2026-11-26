// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  // Dónde vive el sitio: de aquí salen las direcciones canónicas.
  site: 'https://juandiego.vargas.nom.co',
  integrations: [vue()],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
});
