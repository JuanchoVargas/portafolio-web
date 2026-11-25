// La demo del bot de ventas: un catálogo inventado y las reglas con las que
// responde. No hay red ni modelo de lenguaje: es una función pura que recibe
// el estado y el mensaje, y devuelve el estado nuevo y las respuestas.
// Ningún producto, precio ni existencia corresponde a una tienda real.

export type ProductId = 'astronaut' | 'pirate' | 'dinosaur' | 'witch' | 'vampire' | 'firefighter';

export interface Product {
  id: ProductId;
  price: number;
  // Tallas del producto y, de ellas, las que no tienen existencias.
  sizes: readonly string[];
  out: readonly string[];
  // Las tallas de adulto (S, M, L…) no se sugieren por edad ni estatura.
  adult: boolean;
  // Palabras con las que se le busca, en español e inglés, sin tildes.
  words: readonly string[];
}

export const products: readonly Product[] = [
  {
    id: 'astronaut',
    price: 89900,
    sizes: ['4', '6', '8', '10', '12'],
    out: ['8'],
    adult: false,
    words: ['astronauta', 'astronaut', 'espacial', 'space', 'cosmonauta'],
  },
  {
    id: 'pirate',
    price: 74900,
    sizes: ['2', '4', '6', '8', '10'],
    out: [],
    adult: false,
    words: ['pirata', 'pirate', 'corsario'],
  },
  {
    id: 'dinosaur',
    price: 82900,
    sizes: ['2', '4', '6'],
    out: ['6'],
    adult: false,
    words: ['dinosaurio', 'dinosaur', 'dino', 'rex'],
  },
  {
    id: 'firefighter',
    price: 79900,
    sizes: ['4', '6', '8', '10'],
    out: ['4', '6', '8', '10'],
    adult: false,
    words: ['bombero', 'bombera', 'firefighter', 'fireman'],
  },
  {
    id: 'witch',
    price: 119900,
    sizes: ['S', 'M', 'L'],
    out: ['L'],
    adult: true,
    words: ['bruja', 'witch', 'hechicera'],
  },
  {
    id: 'vampire',
    price: 129900,
    sizes: ['S', 'M', 'L', 'XL'],
    out: [],
    adult: true,
    words: ['vampiro', 'vampira', 'vampire', 'dracula'],
  },
];

const byId = (id: ProductId) => products.find((p) => p.id === id)!;
const available = (p: Product) => p.sizes.filter((s) => !p.out.includes(s));

// ---------- Normalización ----------

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Palabras que no distinguen un producto de otro.
const STOP = new Set(
  (
    'del de la el los las un una unos unas y o para por con en a que quiero busco buscar necesito ' +
    'tienen tiene tienes hay me mi porfa favor disponible disfraz disfraces traje talla tallas numero ' +
    'nino nina hijo hija bebe anos ano the for of and i need want looking do you have my kid child ' +
    'boy girl son daughter please costume costumes size sizes which what year years old'
  ).split(' '),
);

// Distancia de edición entre dos palabras, con el intercambio de dos letras
// vecinas contado como un solo error ("astronuata").
export function distance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) => [i, ...new Array<number>(cols - 1).fill(0)]);
  for (let j = 0; j < cols; j++) d[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// Errores que se le perdonan a una palabra, según su largo.
const tolerance = (word: string) => (word.length < 4 ? 0 : word.length < 6 ? 1 : word.length < 9 ? 2 : 3);

function isStop(token: string): boolean {
  if (STOP.has(token)) return true;
  // "disfras" es "disfraz" mal escrito: tampoco distingue.
  if (token.length < 5) return false;
  for (const stop of STOP) if (stop.length >= 5 && distance(token, stop) <= 1) return true;
  return false;
}

export interface SearchHit {
  ids: ProductId[];
  // La palabra del catálogo que se entendió cuando venía mal escrita.
  corrected: string | null;
}

// Busca productos por texto libre: palabra exacta, comienzo de palabra o
// palabra con errores de escritura. Devuelve los de mayor puntaje.
export function search(text: string): SearchHit {
  const tokens = normalize(text)
    .split(' ')
    .filter((t) => t.length >= 2 && !isStop(t));
  let best = 0;
  let ids: ProductId[] = [];
  let corrected: string | null = null;
  for (const p of products) {
    let score = 0;
    let fixed: string | null = null;
    for (const token of tokens) {
      let top = 0;
      // De las palabras parecidas se queda con la más cercana.
      let near = tolerance(token) + 1;
      let guess: string | null = null;
      for (const word of p.words) {
        if (token === word) top = Math.max(top, 3);
        else if (token.length >= 4 && word.startsWith(token)) top = Math.max(top, 2);
        else {
          const d = distance(token, word);
          if (d < near) {
            near = d;
            guess = word;
          }
        }
      }
      if (top === 0 && guess) {
        top = 1;
        fixed = guess;
      }
      score += top;
    }
    if (score > best) {
      best = score;
      ids = [p.id];
      corrected = fixed;
    } else if (score === best && score > 0) {
      ids.push(p.id);
      corrected = null;
    }
  }
  return { ids, corrected };
}

// ---------- Tallas ----------

const SIZE_RE = /\b(?:talla|tallas|size|numero|num)\s*(xs|s|m|l|xl|\d{1,2})\b/;
const BARE_SIZE_RE = /^(?:la |the )?(xs|s|m|l|xl|\d{1,2})$/;

// La talla pedida dentro del mensaje ("talla 6", "size M") y el resto del texto.
function parseSize(norm: string): { size: string | null; rest: string } {
  const m = norm.match(SIZE_RE);
  if (!m) return { size: null, rest: norm };
  return { size: m[1].toUpperCase(), rest: norm.replace(SIZE_RE, ' ') };
}

// Estatura (cm) por talla infantil. Tabla de ejemplo, inventada para la demo.
const HEIGHTS: readonly { size: number; from: number; to: number }[] = [
  { size: 2, from: 80, to: 92 },
  { size: 4, from: 93, to: 104 },
  { size: 6, from: 105, to: 116 },
  { size: 8, from: 117, to: 128 },
  { size: 10, from: 129, to: 140 },
  { size: 12, from: 141, to: 152 },
];

export function sizeByHeight(cm: number): number | null {
  return HEIGHTS.find((h) => cm >= h.from && cm <= h.to)?.size ?? null;
}

// El número de talla infantil sigue de cerca a la edad: talla 6, unos 6 años.
export function sizeByAge(years: number): number | null {
  if (years < 1 || years > 13) return null;
  return Math.min(12, Math.max(2, Math.round(years / 2) * 2));
}

type Measure = { kind: 'age'; value: number } | { kind: 'height'; value: number };

// "5 años", "110 cm", "1,10 m". Un número solo vale si el bot acaba de
// preguntar la medida: hasta 13 es edad; de 55 a 175, estatura.
function parseMeasure(raw: string, asked: boolean): Measure | null {
  const text = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  const meters = text.match(/\b1[.,](\d{2})\b/);
  if (meters) return { kind: 'height', value: 100 + Number(meters[1]) };
  const years = text.match(/\b(\d{1,2})\s*(?:anos|ano|years|year|yrs|yo)\b/);
  if (years) return { kind: 'age', value: Number(years[1]) };
  const cm = text.match(/\b(\d{2,3})\s*(?:cm|centimetros|centimeters)\b/);
  if (cm) return { kind: 'height', value: Number(cm[1]) };
  const bare = text.trim().match(/^(\d{1,3})$/);
  if (asked && bare) {
    const n = Number(bare[1]);
    if (n <= 13) return { kind: 'age', value: n };
    if (n >= 55 && n <= 175) return { kind: 'height', value: n };
  }
  return null;
}

// ---------- Intenciones ----------

const INTENTS = {
  human: ['asesor', 'asesora', 'persona', 'humano', 'alguien', 'agente', 'advisor', 'person', 'human', 'someone', 'agent'],
  buy: ['comprar', 'compro', 'comprarlo', 'lo quiero', 'lo llevo', 'pedirlo', 'pedido', 'buy', 'order', 'i want it', 'i will take it'],
  notify: ['avisame', 'avisenme', 'aviso', 'avisar', 'notify', 'notify me', 'let me know'],
  sizeHelp: ['que talla', 'cual talla', 'no se la talla', 'what size', 'which size'],
  catalog: ['catalogo', 'que tienen', 'que tienes', 'que hay', 'que disfraces', 'ver disfraces', 'catalog', 'do you have', 'show me'],
  greet: ['hola', 'buenas', 'buenos dias', 'hi', 'hello', 'hey'],
  reset: ['menu', 'reiniciar', 'empezar de nuevo', 'restart', 'start over'],
} as const;

const says = (norm: string, intent: keyof typeof INTENTS) =>
  INTENTS[intent].some((term) => ` ${norm} `.includes(` ${term} `));

// ---------- Conversación ----------

export interface BotState {
  product: ProductId | null;
  size: string | null;
  // La última talla pedida que resultó agotada: es la que se anota en el aviso.
  missed: string | null;
  // El bot acaba de preguntar edad o estatura.
  asked: boolean;
  // Aviso pedido para cuando vuelva a haber existencias.
  waiting: { product: ProductId; size: string | null } | null;
  // La conversación pasó a una persona: el bot ya no responde.
  human: boolean;
}

export const initialState = (): BotState => ({
  product: null,
  size: null,
  missed: null,
  asked: false,
  waiting: null,
  human: false,
});

export interface BotAction {
  label: string;
  // Lo que se envía como mensaje del visitante al pulsar.
  say: string;
}

export interface BotMessage {
  text: string;
  // Aviso del sistema, no una frase del bot.
  system?: boolean;
  card?: { name: string; price: number; sizes: string; out: string };
  order?: { name: string; size: string; total: number; link: string };
  actions?: BotAction[];
}

// Los textos que usa el motor. Llegan del idioma de la página.
export interface BotTexts {
  products: Record<ProductId, string>;
  slugs: Record<ProductId, string>;
  shopHost: string;
  sizeParam: string;
  units: { years: string; cm: string };
  say: { buy: string; sizeHelp: string; notify: string; human: string };
  act: { buy: string; sizeHelp: string; notify: string; human: string };
  welcome: string;
  found: string;
  understood: string;
  several: string;
  catalog: string;
  sizeOk: string;
  sizeOut: string;
  sizeMissing: string;
  soldOut: string;
  askMeasure: string;
  askWhich: string;
  adultSizes: string;
  measureUnknown: string;
  suggest: string;
  suggestAlt: string;
  suggestNone: string;
  askSizeFirst: string;
  summary: string;
  waitNoted: string;
  waitNoNeed: string;
  handoff: string;
  inInbox: string;
  queued: string;
  fallback: string;
}

const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

export interface BotTurn {
  state: BotState;
  replies: BotMessage[];
}

export function welcome(t: BotTexts): BotMessage {
  return { text: t.welcome };
}

// Una vuelta de la conversación: el mensaje del visitante y lo que sigue.
export function respond(prev: BotState, raw: string, t: BotTexts): BotTurn {
  const state: BotState = { ...prev };
  const norm = normalize(raw);
  const name = (id: ProductId) => t.products[id];
  const human: BotAction = { label: t.act.human, say: t.say.human };
  const buy: BotAction = { label: t.act.buy, say: t.say.buy };
  const sizeHelp: BotAction = { label: t.act.sizeHelp, say: t.say.sizeHelp };
  const notify: BotAction = { label: t.act.notify, say: t.say.notify };
  const turn = (...replies: BotMessage[]): BotTurn => ({ state, replies });

  // Con una persona a cargo el bot calla: el mensaje solo se suma a la bandeja.
  if (state.human) return turn({ text: t.queued, system: true });

  if (says(norm, 'human')) {
    state.human = true;
    state.asked = false;
    return turn({ text: t.handoff }, { text: t.inInbox, system: true });
  }
  if (says(norm, 'reset')) return { state: initialState(), replies: [welcome(t)] };

  // La ficha de un producto, con el estado de la talla pedida si la hay.
  // Con `again` es el producto del que ya se hablaba: solo responde la talla.
  const card = (p: Product, size: string | null, corrected: string | null, again = false): BotMessage => {
    const free = available(p);
    const lines = again ? [] : [fill(corrected ? t.understood : t.found, { name: name(p.id), word: corrected ?? '' })];
    state.missed = size && p.out.includes(size) ? size : null;
    if (free.length === 0) lines.push(t.soldOut);
    else if (size && free.includes(size)) lines.push(fill(t.sizeOk, { size }));
    else if (size && p.out.includes(size)) lines.push(fill(t.sizeOut, { size }));
    else if (size) lines.push(fill(t.sizeMissing, { size, sizes: free.join(', ') }));
    const actions =
      free.length === 0 ? [notify, human] : [buy, p.out.length ? notify : sizeHelp, human];
    return {
      text: lines.join(' '),
      card: again ? undefined : { name: name(p.id), price: p.price, sizes: free.join(', '), out: p.out.join(', ') },
      actions,
    };
  };

  // Pregunta la medida, o las tallas de adulto, que no se sugieren por medida.
  const askSize = (p: Product): BotMessage => {
    if (p.adult) {
      return { text: fill(t.adultSizes, { name: name(p.id), sizes: available(p).join(', ') }), actions: [human] };
    }
    state.asked = true;
    return { text: fill(t.askMeasure, { name: name(p.id) }), actions: [human] };
  };

  const current = state.product ? byId(state.product) : null;

  // Edad o estatura: talla sugerida para el producto del que se habla.
  const measure = parseMeasure(raw, state.asked);
  if (measure) {
    if (!current) return turn({ text: t.askWhich });
    state.asked = false;
    if (current.adult) return turn(askSize(current));
    const ideal = measure.kind === 'age' ? sizeByAge(measure.value) : sizeByHeight(measure.value);
    const base = `${measure.value} ${measure.kind === 'age' ? t.units.years : t.units.cm}`;
    if (ideal === null) return turn({ text: fill(t.measureUnknown, { base }), actions: [human] });
    const free = available(current);
    if (free.includes(String(ideal))) {
      state.size = String(ideal);
      return turn({
        text: fill(t.suggest, { base, size: state.size, name: name(current.id) }),
        actions: [buy, human],
      });
    }
    // Sin la ideal: la talla con existencias más cercana.
    const near = free
      .map(Number)
      .sort((a, b) => Math.abs(a - ideal) - Math.abs(b - ideal))[0];
    if (near === undefined) {
      state.size = null;
      state.missed = String(ideal);
      return turn({
        text: fill(t.suggestNone, { base, size: String(ideal), name: name(current.id) }),
        actions: [notify, human],
      });
    }
    state.size = String(near);
    state.missed = current.out.includes(String(ideal)) ? String(ideal) : null;
    return turn({
      text: fill(t.suggestAlt, { base, size: String(ideal), near: String(near), name: name(current.id) }),
      actions: [buy, notify, human],
    });
  }

  // Búsqueda por texto libre.
  const { size, rest } = parseSize(norm);
  const hit = search(rest);
  if (hit.ids.length === 1) {
    const p = byId(hit.ids[0]);
    state.product = p.id;
    state.size = size && available(p).includes(size) ? size : null;
    state.asked = false;
    return turn(card(p, size, hit.corrected));
  }
  if (hit.ids.length > 1) {
    return turn({
      text: t.several,
      actions: hit.ids.slice(0, 3).map((id) => ({ label: name(id), say: name(id) })),
    });
  }

  if (current) {
    // Una talla suelta: "talla 6", "la M".
    const asked = size ?? norm.match(BARE_SIZE_RE)?.[1].toUpperCase() ?? null;
    if (asked) {
      state.asked = false;
      state.size = available(current).includes(asked) ? asked : null;
      return turn(card(current, asked, null, true));
    }
    if (says(norm, 'notify')) {
      if (current.out.length === 0) return turn({ text: fill(t.waitNoNeed, { name: name(current.id) }), actions: [buy, human] });
      state.waiting = { product: current.id, size: state.missed };
      return turn({ text: fill(t.waitNoted, { name: name(current.id) }), actions: [human] });
    }
    if (says(norm, 'buy')) {
      if (!state.size) {
        const ask = askSize(current);
        return turn({ ...ask, text: `${t.askSizeFirst} ${ask.text}` });
      }
      const link = `${t.shopHost}/${t.slugs[current.id]}?${t.sizeParam}=${state.size}`;
      return turn({
        text: t.summary,
        order: { name: name(current.id), size: state.size, total: current.price, link },
        actions: [human],
      });
    }
    if (says(norm, 'sizeHelp')) return turn(askSize(current));
  }

  if (says(norm, 'catalog')) {
    return turn({
      text: fill(t.catalog, { list: products.map((p) => name(p.id)).join(', ') }),
      actions: products.slice(0, 3).map((p) => ({ label: name(p.id), say: name(p.id) })),
    });
  }
  if (says(norm, 'greet')) return turn(welcome(t));

  // Nada de lo anterior: se dice sin rodeos y se ofrecen salidas.
  return turn({
    text: t.fallback,
    actions: [{ label: name('astronaut'), say: name('astronaut') }, { label: name('pirate'), say: name('pirate') }, human],
  });
}
