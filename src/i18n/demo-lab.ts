// Palabras que comparten las misiones de todas las demos. Cada demo las lleva
// junto a sus textos (`lab`), así el marco de pestañas no necesita saber el idioma.
export const labWords = {
  en: {
    mission: 'Mission',
    done: 'done',
    todo: 'to do',
    complete: 'mission complete',
    want: 'I want this',
  },
  es: {
    mission: 'Misión',
    done: 'hecho',
    todo: 'pendiente',
    complete: 'misión completa',
    want: 'Quiero esto',
  },
} as const;
