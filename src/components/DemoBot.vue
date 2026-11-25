<script setup lang="ts">
// Bot de ventas de una tienda de disfraces. El visitante escribe como cliente
// y el bot responde por reglas: busca aunque venga mal escrito, sugiere la
// talla y pasa la conversación a una persona. A la derecha, lo que ve el
// equipo. Nada sale del navegador: catálogo y lógica están en
// src/data/demo-bot.ts y son ficticios.
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { initialState, respond, search, welcome, type BotMessage, type BotState, type BotTexts } from '../data/demo-bot';

interface Texts extends BotTexts {
  chatTitle: string;
  inputLabel: string;
  placeholder: string;
  send: string;
  you: string;
  bot: string;
  typing: string;
  suggestLabel: string;
  suggestions: readonly string[];
  restart: string;
  cardSizes: string;
  cardOut: string;
  orderSize: string;
  orderTotal: string;
  orderLink: string;
  panelTitle: string;
  statusBot: string;
  statusHuman: string;
  panelProduct: string;
  panelSize: string;
  panelWaiting: string;
  panelMessages: string;
  panelEmpty: string;
  panelAnySize: string;
  panelNote: string;
}

interface Entry extends BotMessage {
  id: number;
  from: 'user' | 'bot';
}

// `hint`: el paso de la misión que sigue; su mensaje sugerido lleva el guiño.
const props = defineProps<{ t: Texts; thousands: string; stamp: string; hint?: string }>();
const emit = defineEmits<{ step: [key: string] }>();

// El mensaje sugerido (por posición) que cumple cada paso de la misión.
const hintAt: Record<string, number> = { find: 0, size: 2, human: 3 };

// Lo que tarda el bot en "escribir". Sin movimiento, responde de una vez.
const TYPING_MS = 520;

const money = (n: number) => `$ ${String(n).replace(/\B(?=(\d{3})+$)/g, props.thousands)}`;

let nextId = 1;
const entry = (from: Entry['from'], message: BotMessage): Entry => ({ ...message, id: nextId++, from });

const state = ref<BotState>(initialState());
const entries = ref<Entry[]>([entry('bot', welcome(props.t))]);
const draft = ref('');
const typing = ref(false);
const log = ref<HTMLElement>();
let timer = 0;

// Solo baja el historial: la página no se mueve.
async function toEnd() {
  await nextTick();
  if (log.value) log.value.scrollTop = log.value.scrollHeight;
}

function send(text: string) {
  const message = text.trim();
  if (!message || typing.value) return;
  draft.value = '';
  entries.value.push(entry('user', { text: message }));
  const prev = state.value;
  const turn = respond(prev, message, props.t);
  const deliver = () => {
    typing.value = false;
    state.value = turn.state;
    // Pasos de la misión: encontró un disfraz, llegó a una talla, pasó a una persona.
    if (turn.state.product && search(message).ids.length > 0) emit('step', 'find');
    if (turn.state.size && turn.state.size !== prev.size) emit('step', 'size');
    if (turn.state.human && !prev.human) emit('step', 'human');
    for (const reply of turn.replies) entries.value.push(entry('bot', reply));
    toEnd();
  };
  // Con una persona a cargo nadie "escribe": el aviso sale enseguida.
  const instant = state.value.human || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (instant) {
    deliver();
    return;
  }
  typing.value = true;
  toEnd();
  timer = window.setTimeout(deliver, TYPING_MS);
}

function restart() {
  window.clearTimeout(timer);
  typing.value = false;
  state.value = initialState();
  entries.value = [entry('bot', welcome(props.t))];
}

// Los botones de respuesta solo valen en el último mensaje.
const lastId = computed(() => entries.value[entries.value.length - 1].id);
const sent = computed(() => entries.value.filter((e) => e.from === 'user').length);
const waiting = computed(() => {
  const w = state.value.waiting;
  if (!w) return props.t.panelEmpty;
  return `${props.t.products[w.product]} · ${w.size ?? props.t.panelAnySize}`;
});

onBeforeUnmount(() => window.clearTimeout(timer));
</script>

<template>
  <div class="demo">
    <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
    <div class="bot">
      <section class="bot__chat" :aria-label="t.chatTitle">
        <ol ref="log" class="bot__log" role="log" aria-live="polite" tabindex="0" :aria-label="t.chatTitle">
          <li
            v-for="e in entries"
            :key="e.id"
            class="bot__msg"
            :class="e.system ? 'bot__msg--system' : `bot__msg--${e.from}`"
          >
            <span v-if="!e.system" class="visually-hidden">{{ e.from === 'user' ? t.you : t.bot }}:</span>
            <p>{{ e.text }}</p>
            <dl v-if="e.card" class="bot__card">
              <div class="bot__card-top">
                <dt>{{ e.card.name }}</dt>
                <dd class="bot__num">{{ money(e.card.price) }}</dd>
              </div>
              <div v-if="e.card.sizes">
                <dt>{{ t.cardSizes }}</dt>
                <dd>{{ e.card.sizes }}</dd>
              </div>
              <div v-if="e.card.out" class="bot__card-out">
                <dt>{{ t.cardOut }}</dt>
                <dd>{{ e.card.out }}</dd>
              </div>
            </dl>
            <dl v-if="e.order" class="bot__card bot__card--order">
              <div class="bot__card-top">
                <dt>{{ e.order.name }}</dt>
                <dd>{{ t.orderSize }} {{ e.order.size }}</dd>
              </div>
              <div>
                <dt>{{ t.orderTotal }}</dt>
                <dd class="bot__num">{{ money(e.order.total) }}</dd>
              </div>
              <div>
                <dt>{{ t.orderLink }}</dt>
                <dd class="bot__link">{{ e.order.link }}</dd>
              </div>
            </dl>
            <div v-if="e.actions && e.id === lastId" class="bot__actions">
              <button v-for="a in e.actions" :key="a.label" class="chip" type="button" @click="send(a.say)">
                {{ a.label }}
              </button>
            </div>
          </li>
          <li v-if="typing" class="bot__msg bot__msg--bot bot__msg--typing">
            <p>{{ t.typing }}</p>
          </li>
        </ol>
        <div class="bot__suggest" role="group" :aria-label="t.suggestLabel">
          <button v-if="state.human" class="chip chip--go" type="button" @click="restart">{{ t.restart }}</button>
          <template v-else>
            <button
              v-for="(s, i) in t.suggestions"
              :key="s"
              class="chip"
              type="button"
              :class="{ 'is-hint': hint !== undefined && hintAt[hint] === i }"
              @click="send(s)"
            >
              {{ s }}
            </button>
          </template>
        </div>
        <form class="bot__form" @submit.prevent="send(draft)">
          <label class="visually-hidden" for="demo-bot-input">{{ t.inputLabel }}</label>
          <input
            id="demo-bot-input"
            v-model="draft"
            class="bot__input"
            type="text"
            maxlength="120"
            autocomplete="off"
            enterkeyhint="send"
            :placeholder="t.placeholder"
          />
          <button class="bot__send" type="submit" :disabled="typing">{{ t.send }}</button>
        </form>
      </section>
      <aside class="bot__panel" :aria-label="t.panelTitle">
        <h3 class="mono bot__head">{{ t.panelTitle }}</h3>
        <p class="bot__status" :data-human="state.human" role="status">
          {{ state.human ? t.statusHuman : t.statusBot }}
        </p>
        <dl class="bot__facts">
          <div>
            <dt>{{ t.panelProduct }}</dt>
            <dd>{{ state.product ? t.products[state.product] : t.panelEmpty }}</dd>
          </div>
          <div>
            <dt>{{ t.panelSize }}</dt>
            <dd>{{ state.size ?? t.panelEmpty }}</dd>
          </div>
          <div>
            <dt>{{ t.panelWaiting }}</dt>
            <dd>{{ waiting }}</dd>
          </div>
          <div>
            <dt>{{ t.panelMessages }}</dt>
            <dd class="bot__num">{{ sent }}</dd>
          </div>
        </dl>
        <p class="bot__panel-note">{{ t.panelNote }}</p>
      </aside>
    </div>
  </div>
</template>
