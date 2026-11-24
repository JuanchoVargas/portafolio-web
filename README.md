# Portafolio web

Sitio personal de Juan Diego Vargas: proyectos, servicios y contacto. Hecho con [Astro](https://astro.build), en inglés y español.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run dev` | Abre el sitio en `http://localhost:4321` y recarga al guardar |
| `npm run build` | Genera el sitio en `dist/` |
| `npm run preview` | Sirve lo que quedó en `dist/` |

## Agregar un proyecto

1. Copiar las capturas a `src/assets/projects/<nombre>/`.
2. Crear `src/content/projects/en/<nombre>.md` y `src/content/projects/es/<nombre>.md`, con el mismo nombre de archivo en los dos idiomas.
3. Llenar el encabezado del archivo:

```markdown
---
title: "Nombre del proyecto"
tagline: "Una línea que dice qué es y para quién"
kind: source # source: el código es público. case-study: no lo es.
status: "En producción"
order: 5 # posición en la lista
stack: ["Vue 3", "PostgreSQL"]
repo: "https://github.com/usuario/repo" # opcional
live: "https://ejemplo.com" # opcional
cover: "../../../assets/projects/<nombre>/portada.png" # opcional
gallery:
  - src: "../../../assets/projects/<nombre>/pantalla.png"
    alt: "Qué muestra la pantalla"
highlights:
  - "Lo más importante, en una frase"
metrics:
  - value: "120"
    label: "pruebas automatizadas"
---

## El problema

Texto del proyecto en Markdown.
```

Reglas del encabezado: `tagline` admite máximo 110 caracteres y `year` es opcional (por ejemplo `year: "2026"`). El archivo debe existir en los dos idiomas; si falta uno, el botón de idioma lleva a una página que no existe.

El proyecto aparece solo en la portada y recibe su propia página. Con `draft: true` queda oculto. Si no tiene `cover`, el sitio dibuja una portada con el título.

## Dónde está cada cosa

- `src/content/projects/`: los proyectos.
- `src/i18n/ui.ts`: los textos de la portada, en los dos idiomas.
- `src/data/site.ts`: nombre, enlaces, la etiqueta de disponibilidad y la dirección que recibe el formulario de contacto (`formEndpoint`). Mientras esté vacía, la portada publicada muestra los botones de LinkedIn y GitHub en lugar del formulario; en `npm run dev` el formulario se ve siempre.
- `src/components/Scene.astro` y `src/assets/personaje/`: el personaje. Tiene una pose por sección de la portada y la cambia según lo que se esté leyendo; en pantallas angostas acompaña desde una esquina. La lista de proyectos puede crecer sin tocarlo.
- `src/styles/global.css`: colores, tipografía y diseño.
