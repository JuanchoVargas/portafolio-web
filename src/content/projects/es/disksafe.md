---
title: "disksafe"
tagline: "Herramienta de PowerShell para liberar espacio en el disco de Windows sin arriesgar datos"
kind: source
status: "Código abierto · v0.1.0"
order: 4
stack: ["PowerShell", "C# (P/Invoke)", "robocopy", "Pester"]
repo: "https://github.com/JuanchoVargas/disksafe"
cover: "../../../assets/projects/disksafe/03-move-clean.png"
gallery:
  - src: "../../../assets/projects/disksafe/01-scan.png"
    alt: "Terminal con disksafe scan: unidades del equipo, hallazgos limpiables y movibles, y el estimado de espacio por categoría"
  - src: "../../../assets/projects/disksafe/02-advise.png"
    alt: "Terminal con disksafe advise: comandos de Windows recomendados con su ganancia estimada, sin ejecutar ninguno"
highlights:
  - "Simulación por defecto: nada cambia hasta pasar -Execute"
  - "El origen solo se borra si todo coincide por SHA-256 en el destino"
  - "Un punto del código borra y otro mueve; un test lo hace cumplir"
  - "Falla cerrado: una ruta que no se resuelve se trata como protegida"
metrics:
  - value: "677"
    label: "tests que pasan"
  - value: "4"
    label: "comandos"
  - value: "0"
    label: "dependencias externas"
---

## El problema

Cuando el disco del sistema se llena, lo habitual es correr un script de limpieza copiado de un foro o borrar carpetas a mano. Las dos cosas pueden dañar Windows o hacer perder trabajo. Quería una herramienta que muestre exactamente qué va a tocar antes de tocarlo.

## Lo que construí

Un módulo de PowerShell con cuatro comandos, para Windows PowerShell 5.1 y PowerShell 7, sin dependencias externas.

- `scan` mide qué ocupa espacio y clasifica cada hallazgo: limpiable seguro, movible, movible con procedimiento o no tocar.
- `advise` imprime los comandos de Windows que conviene ejecutar y su ganancia estimada, sin ejecutarlos.
- `clean` borra temporales antiguos del usuario y cachés de navegadores, npm, pip y NuGet.
- `move` lleva repositorios y carpetas de datos a otra partición y deja una bitácora para deshacer la operación.

## Seguridad por diseño

Una herramienta que borra archivos debe fallar hacia el lado seguro.

- Las rutas protegidas viven en un solo archivo, y la ruta real se resuelve y se vuelve a validar justo antes de actuar.
- Nunca se siguen enlaces, y la copia no usa opciones destructivas de robocopy.
- Cada operación escribe su intención antes de actuar y el resultado por elemento después.
- No se eleva sola: indica qué comando necesita permisos de administrador.
- Un test analiza todo el código fuente y falla si algo modifica el sistema fuera de los archivos permitidos.

## Estado

Versión 0.1.0, licencia MIT. La suite pasa en las dos versiones de PowerShell y trabaja solo sobre carpetas temporales. La ejecución real de `clean` y `move` en un equipo sigue en validación, y los riesgos residuales están documentados en el repositorio.
