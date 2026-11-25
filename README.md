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
- `src/i18n/ui.ts`: todos los textos visibles, en los dos idiomas.
- `src/data/site.ts`: nombre, enlaces, la etiqueta de disponibilidad (es el sello de la portada) y la dirección que recibe el formulario de contacto (`formEndpoint`). Mientras esté vacía, la portada publicada muestra los botones de LinkedIn y GitHub en lugar del formulario; en `npm run dev` el formulario se ve siempre.
- `src/data/sheets.ts`: las hojas de la portada, en orden, y la pose del personaje en cada una.
- `src/data/poses.ts` y `src/assets/personaje/`: las poses del personaje (imagen fija y clip).
- `src/data/demo.ts`: los datos de las dos demos. Son inventados.

## Cómo está organizado el diseño

El sitio es un plano técnico en tinta y papel: fondo cuadriculado, tinta negra, un solo color de acento, bordes gruesos con sombra dura.

### Valores de diseño

`src/styles/tokens.css` reúne fuentes, colores, bordes, sombras, curvas y medidas generales. Ningún otro archivo de estilos escribe un color o una fuente: todos consumen esas variables. Las fuentes se sirven desde el propio sitio con paquetes `@fontsource`, importados en ese mismo archivo.

### Estilos

`src/styles/global.css` solo importa los demás, en orden:

| Archivo | Qué contiene |
|---|---|
| `tokens.css` | Valores de diseño |
| `base.css` | Reinicio, papel cuadriculado, tipografía y movimiento reducido |
| `plano.css` | Piezas de plano |
| `layout.css` | Cabecera y pie |
| `figure.css` | El personaje: imagen fija, clip y rellenos |
| `home.css` | Portada, hojas y escena fija |
| `demos.css` | Marco y tabla de las demos |
| `project.css` | Capturas y página de proyecto |

### Piezas de plano

Clases sueltas que sirven en cualquier página (`plano.css`):

- `.titleblock`: el cajetín, rótulo de esquina con proyecto, hoja y revisión.
- `.dim` y `.dim-v`: cotas horizontal y vertical, con su rótulo dentro.
- `.stamp`: sello.
- `.cut`: recorte pegado con cinta; la inclinación va en `--r`.
- `.note` con `.hand`: nota a lápiz.
- `.detail`: marca de detalle, un círculo con letra.
- `.balloon`: globo del personaje.
- `.btn`, `.chip`, `.chips`, `.tag`, `.label`, `.link`, `.points`, `.list`: botones, pastillas, etiquetas y listas.

Dentro de un elemento con `data-sheet`, las cotas se extienden y el sello cae cuando ese elemento recibe la clase `is-on`. Sin scripts o con movimiento reducido se ven desde el principio.

### Portada y escena

- `HomePage.astro` arma la portada (hoja 01, en flujo normal) y el contenido de cada hoja.
- `Sheet.astro` es una hoja: rótulo, título con su marca de detalle, cota y contenido.
- `Scene.astro` envuelve las hojas y lleva el riel, el personaje y el script.
- `Figure.astro` dibuja una pose del personaje.

Por defecto las hojas van apiladas, cada una con la imagen fija de su rol. Así se ven en celular, en pantallas bajas, con movimiento reducido y sin scripts. En pantallas de al menos 1000 × 700 px la escena queda fija: cada tramo de scroll pasa a la hoja siguiente, las hojas inactivas quedan fuera del teclado (`inert`) y el personaje cruza caminando al lado contrario y toma la pose de la hoja. La condición está escrita dos veces y debe coincidir: en `home.css` y en la constante `PINNED` de `Scene.astro`.

El número, la letra y el lado de cada hoja salen de su posición en `sheets.ts`. Las anclas (`#work`, `#services`…) son los `id` de esa lista.

Cada clip del personaje se descarga al llegar a su pose y reemplaza a la imagen fija cuando empieza a reproducirse. En Safari, en pantallas angostas y con movimiento reducido se queda la imagen fija. El encaje del clip sobre la imagen está en `poses.ts`.

### Demos

`DemoGrid.vue` (grilla que ordena, filtra y busca) y `DemoRoles.vue` (matriz de permisos que responde 200 o 403) son componentes Vue que se activan al entrar a la vista. Reciben los textos por props desde `ui.ts` y leen los datos de `demo.ts`. Se generan también en el servidor, así que sin scripts se ven completas.

Las piezas se hablan con eventos del DOM, definidos en `src/lib/events.ts`: la demo de roles avisa el rol elegido y la escena cambia la pose del personaje; la escena avisa cuando entra una hoja.

## Montar otro sitio sobre esta base

1. **Piel:** cambiar `src/styles/tokens.css` (colores, fuentes, bordes, sombras). Si cambian las fuentes, instalar sus paquetes `@fontsource` y ajustar los `@import` del mismo archivo.
2. **Textos:** `src/i18n/ui.ts` y `src/data/site.ts`.
3. **Hojas:** editar la lista de `src/data/sheets.ts` y el contenido de cada hoja en `HomePage.astro`. El riel, la numeración y el recorrido se ajustan solos.
4. **Personaje:** reemplazar las imágenes y clips de `src/assets/personaje/` y su encaje en `src/data/poses.ts`. Las imágenes miden 939 × 1400 px (la de sentado, 1875 × 1400) y la de caminar mira a la derecha. Si la pose sentada o la de entregar la hoja cambian, revisar los rellenos de `figure.css`.
5. **Demos:** cambiar los datos en `src/data/demo.ts` o reemplazar los componentes; solo necesitan el marco `.demo`.
6. **Contenido:** los proyectos de `src/content/projects/`.
