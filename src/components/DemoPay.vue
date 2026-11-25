<script setup lang="ts">
// Cobro en línea de mentira, con el servidor a la vista. Cada botón es un
// intento distinto (pagar, alterar el precio, repetir la notificación, llegar
// sin firma) y la bitácora muestra qué responde el servidor. Nada sale del
// navegador: los datos son ficticios (src/data/demo.ts).
import { computed, onBeforeUnmount, ref } from 'vue';
import { cart, tamperedTotal } from '../data/demo';

type Try = 'pay' | 'tamper' | 'repeat' | 'unsigned';
interface Line {
  code: string;
  text: string;
}

interface Texts {
  tryLabel: string;
  tries: Record<Try, string>;
  browser: string;
  server: string;
  items: readonly string[];
  total: string;
  sent: string;
  idle: string;
  orders: string;
  charged: string;
  rejected: string;
  log: Record<Try, readonly string[]>;
}

// `hint`: el paso de la misión que sigue; su botón lleva el guiño.
const props = defineProps<{ t: Texts; thousands: string; stamp: string; hint?: string }>();
const emit = defineEmits<{ step: [key: string] }>();

const tries: Try[] = ['pay', 'tamper', 'repeat', 'unsigned'];
// El código con el que responde cada paso de cada intento.
const codes: Record<Try, string[]> = {
  pay: ['POST', '200', '200', '201'],
  tamper: ['POST', '422'],
  repeat: ['POST', '201', '200', '200'],
  unsigned: ['POST', '401'],
};
const STEP_MS = 420;

const money = (n: number) => `$ ${String(n).replace(/\B(?=(\d{3})+$)/g, props.thousands)}`;
const realTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

const current = ref<Try | null>(null);
const lines = ref<Line[]>([]);
const orders = ref(0);
const rejected = ref(0);
let nextOrder = 1042;
let nextPayment = 8841;
let timer = 0;

// Lo que el navegador dice que vale el pedido: solo miente en un intento.
const sentTotal = computed(() => (current.value === 'tamper' ? tamperedTotal : realTotal));

function run(kind: Try) {
  window.clearTimeout(timer);
  current.value = kind;
  lines.value = [];
  const order = `#${nextOrder}`;
  const payment = `pay_${nextPayment}`;
  const fill = (text: string) =>
    text
      .replace('{total}', money(realTotal))
      .replace('{sent}', money(tamperedTotal))
      .replace('{order}', order)
      .replace('{payment}', payment);
  const script = props.t.log[kind].map((text, i) => ({ code: codes[kind][i], text: fill(text) }));

  const step = (i: number) => {
    lines.value.push(script[i]);
    if (i < script.length - 1) {
      timer = window.setTimeout(() => step(i + 1), STEP_MS);
      return;
    }
    if (kind === 'pay' || kind === 'repeat') {
      // Un pago, una orden: aunque la notificación llegue tres veces.
      orders.value++;
      nextOrder++;
      nextPayment++;
    } else {
      rejected.value++;
    }
    // El paso de la misión cuenta cuando el servidor termina de responder.
    emit('step', kind);
  };
  step(0);
}

const bad = (code: string) => code.startsWith('4');

onBeforeUnmount(() => window.clearTimeout(timer));
</script>

<template>
  <div class="demo">
    <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
    <div class="demo__bar">
      <span id="demo-pay-try" class="mono">{{ t.tryLabel }}</span>
      <div class="demo__group" role="group" aria-labelledby="demo-pay-try">
        <button
          v-for="kind in tries"
          :key="kind"
          class="chip"
          type="button"
          :aria-pressed="current === kind"
          :class="{ 'is-hint': hint === kind }"
          @click="run(kind)"
        >
          {{ t.tries[kind] }}
        </button>
      </div>
    </div>
    <div class="pay">
      <section class="pay__side" :aria-label="t.browser">
        <h3 class="mono pay__head">{{ t.browser }}</h3>
        <ul class="pay__cart">
          <li v-for="(item, i) in cart" :key="item.sku">
            <span>{{ item.qty }} × {{ t.items[i] }}</span>
            <span class="pay__num">{{ money(item.price * item.qty) }}</span>
          </li>
        </ul>
        <p class="pay__total">
          <span>{{ current === 'tamper' ? t.sent : t.total }}</span>
          <b class="pay__num" :data-bad="current === 'tamper'">{{ money(sentTotal) }}</b>
        </p>
      </section>
      <section class="pay__side pay__side--log" :aria-label="t.server">
        <h3 class="mono pay__head">{{ t.server }}</h3>
        <ol class="pay__log" role="log" aria-live="polite">
          <li v-if="lines.length === 0" class="pay__idle">{{ t.idle }}</li>
          <li v-for="(line, i) in lines" :key="i" class="pay__line">
            <b class="demo__code" :data-bad="bad(line.code)">{{ line.code }}</b>
            <span>{{ line.text }}</span>
          </li>
        </ol>
      </section>
    </div>
    <p class="demo__foot" role="status" aria-live="polite">
      <span>{{ t.orders.replace('{n}', String(orders)) }} · {{ t.charged.replace('{sum}', money(orders * realTotal)) }}</span>
      <span>{{ t.rejected.replace('{n}', String(rejected)) }}</span>
    </p>
  </div>
</template>
