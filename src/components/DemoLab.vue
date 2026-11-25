<script setup lang="ts">
// Las demos de la hoja, en pestañas. Todas quedan montadas para que cada una
// conserve su estado al cambiar de pestaña. Cada demo tiene un papel y una
// misión de tres pasos: la demo avisa cuando el visitante cumple uno (`step`)
// y aquí se lleva la cuenta, se señala el siguiente (`hint`) y se remata.
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import DemoAgenda from './DemoAgenda.vue';
import DemoBot from './DemoBot.vue';
import DemoPay from './DemoPay.vue';
import DemoQuote from './DemoQuote.vue';

type Tab = 'bot' | 'agenda' | 'quote' | 'pay';
// Lo que cada demo trae junto a sus textos: pestaña, papel, misión y remate.
interface Mission {
  tab: string;
  // Pista a lápiz cuando la misión ya está completa.
  note: string;
  role: string;
  // Por paso: el rótulo de la casilla y la pista de cómo cumplirlo.
  steps: Record<string, { label: string; hint: string }>;
  win: string;
  // Con lo que empieza el mensaje de contacto al pedir "esto".
  quote: string;
  lab: { mission: string; done: string; todo: string; complete: string; want: string };
}
type Labelled<T> = T & Mission;

const props = defineProps<{
  label: string;
  bot: Labelled<InstanceType<typeof DemoBot>['$props']['t']>;
  agenda: Labelled<InstanceType<typeof DemoAgenda>['$props']['t']>;
  quote: Labelled<InstanceType<typeof DemoQuote>['$props']['t']>;
  pay: Labelled<InstanceType<typeof DemoPay>['$props']['t']>;
  thousands: string;
  stamp: string;
}>();

const tabs: Tab[] = ['bot', 'agenda', 'quote', 'pay'];
// Los pasos de cada misión, en el orden en que se proponen.
const missions: Record<Tab, string[]> = {
  bot: ['find', 'size', 'human'],
  agenda: ['book', 'clash', 'alert'],
  quote: ['customer', 'send', 'approve'],
  pay: ['pay', 'tamper', 'repeat'],
};

const tab = ref<Tab>('bot');
const done = reactive<Record<Tab, string[]>>({ bot: [], agenda: [], quote: [], pay: [] });
// La demo que acaba de completar su misión, mientras dura el destello.
const cheer = ref<Tab | null>(null);
let cheerTimer = 0;

const pending = (id: Tab) => missions[id].find((step) => !done[id].includes(step));
const won = (id: Tab) => done[id].length === missions[id].length;
const now = computed(() => props[tab.value]);
const next = computed(() => pending(tab.value));

function mark(id: Tab, step: string) {
  if (!missions[id].includes(step) || done[id].includes(step)) return;
  done[id].push(step);
  if (!won(id)) return;
  cheer.value = id;
  window.clearTimeout(cheerTimer);
  cheerTimer = window.setTimeout(() => (cheer.value = null), 1200);
}

// Flechas: cambian de pestaña y llevan el foco, como pide el patrón de pestañas.
function move(e: KeyboardEvent, dir: 1 | -1) {
  const i = (tabs.indexOf(tab.value) + dir + tabs.length) % tabs.length;
  tab.value = tabs[i];
  const list = (e.currentTarget as HTMLElement).parentElement!;
  (list.children[i] as HTMLElement).focus();
}

onBeforeUnmount(() => window.clearTimeout(cheerTimer));
</script>

<template>
  <div class="lab">
    <div class="lab__tabs" role="tablist" :aria-label="label">
      <button
        v-for="(id, i) in tabs"
        :id="`lab-tab-${id}`"
        :key="id"
        class="lab__tab"
        type="button"
        role="tab"
        :aria-selected="tab === id"
        :aria-controls="`lab-panel-${id}`"
        :tabindex="tab === id ? 0 : -1"
        :data-won="won(id)"
        @click="tab = id"
        @keydown.right.prevent="move($event, 1)"
        @keydown.left.prevent="move($event, -1)"
      >
        <span class="lab__n" aria-hidden="true">{{ won(id) ? '✓' : i + 1 }}</span>
        {{ props[id].tab }}
        <span v-if="won(id)" class="visually-hidden">({{ props[id].lab.complete }})</span>
        <span v-else-if="done[id].length" class="lab__count">{{ done[id].length }}/{{ missions[id].length }}</span>
      </button>
    </div>
    <div class="lab__brief" :data-won="won(tab)">
      <span class="mono lab__role">{{ now.role }}</span>
      <ol v-if="!won(tab)" class="lab__steps" :aria-label="now.lab.mission">
        <li
          v-for="step in missions[tab]"
          :key="step"
          class="lab__step"
          :data-done="done[tab].includes(step)"
          :aria-current="next === step ? 'step' : undefined"
        >
          <span class="lab__box" aria-hidden="true">{{ done[tab].includes(step) ? '✓' : '' }}</span>
          {{ now.steps[step].label }}
          <span class="visually-hidden">({{ done[tab].includes(step) ? now.lab.done : now.lab.todo }})</span>
        </li>
      </ol>
      <p class="lab__win" role="status" aria-live="polite">
        <template v-if="won(tab)">{{ now.win }}</template>
      </p>
      <a v-if="won(tab)" class="chip chip--go lab__want" href="#contact" :data-quote="now.quote">
        {{ now.lab.want }}
      </a>
    </div>
    <div
      v-show="tab === 'bot'"
      id="lab-panel-bot"
      class="lab__panel"
      :class="{ 'is-cheer': cheer === 'bot' }"
      role="tabpanel"
      aria-labelledby="lab-tab-bot"
    >
      <DemoBot :t="bot" :thousands="thousands" :stamp="stamp" :hint="pending('bot')" @step="mark('bot', $event)" />
    </div>
    <div
      v-show="tab === 'agenda'"
      id="lab-panel-agenda"
      class="lab__panel"
      :class="{ 'is-cheer': cheer === 'agenda' }"
      role="tabpanel"
      aria-labelledby="lab-tab-agenda"
    >
      <DemoAgenda :t="agenda" :stamp="stamp" :hint="pending('agenda')" @step="mark('agenda', $event)" />
    </div>
    <div
      v-show="tab === 'quote'"
      id="lab-panel-quote"
      class="lab__panel"
      :class="{ 'is-cheer': cheer === 'quote' }"
      role="tabpanel"
      aria-labelledby="lab-tab-quote"
    >
      <DemoQuote
        :t="quote"
        :thousands="thousands"
        :stamp="stamp"
        :hint="pending('quote')"
        @step="mark('quote', $event)"
      />
    </div>
    <div
      v-show="tab === 'pay'"
      id="lab-panel-pay"
      class="lab__panel"
      :class="{ 'is-cheer': cheer === 'pay' }"
      role="tabpanel"
      aria-labelledby="lab-tab-pay"
    >
      <DemoPay :t="pay" :thousands="thousands" :stamp="stamp" :hint="pending('pay')" @step="mark('pay', $event)" />
    </div>
    <p class="note hand sheet__note">{{ next ? now.steps[next].hint : now.note }}</p>
  </div>
</template>
