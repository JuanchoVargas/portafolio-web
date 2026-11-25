<script setup lang="ts">
// Cotización en un minuto: el visitante hace de vendedor. A la izquierda
// elige cliente, cantidades y descuento; a la derecha ve el documento como lo
// recibe el cliente. Al enviarla recibe número y deja de editarse; al
// aprobarla se congelan los precios y se genera el pedido. Nada sale del
// navegador: los datos son ficticios (src/data/demo-quote.ts).
import { computed, ref } from 'vue';
import {
  discounts,
  MAX_QTY,
  quoteCustomers,
  quoteProducts,
  quoteStates,
  quoteTotals,
  type Discount,
  type PriceList,
  type QuoteState,
} from '../data/demo-quote';

interface Texts {
  customerLabel: string;
  lists: Record<PriceList, string>;
  products: readonly string[];
  builder: string;
  less: string;
  more: string;
  qty: string;
  discountLabel: string;
  noDiscount: string;
  docTitle: string;
  company: string;
  draftNumber: string;
  forLabel: string;
  colItem: string;
  colQty: string;
  colPrice: string;
  colTotal: string;
  empty: string;
  subtotal: string;
  discount: string;
  total: string;
  statesLabel: string;
  states: Record<QuoteState, string>;
  send: string;
  approve: string;
  reset: string;
  status: Record<QuoteState, string>;
  orders: string;
  sold: string;
}

// `hint`: el paso de la misión que sigue; el control que lo cumple lleva el guiño.
const props = defineProps<{ t: Texts; thousands: string; stamp: string; hint?: string }>();
const emit = defineEmits<{ step: [key: string] }>();

// La cotización con la que arranca la demo, para que el documento no salga vacío.
const START = [1, 2, 0, 0];

const customer = ref(0);
const qty = ref([...START]);
const discount = ref<Discount>(0);
const state = ref<QuoteState>('draft');
const number = ref('');
const orders = ref(0);
const sold = ref(0);
let nextNumber = 101;

const money = (n: number) => `$ ${String(n).replace(/\B(?=(\d{3})+$)/g, props.thousands)}`;
const named = (text: string, product: number) => text.replace('{product}', props.t.products[product]);

const totals = computed(() => quoteTotals(qty.value, quoteCustomers[customer.value], discount.value));
// Solo el borrador se edita.
const locked = computed(() => state.value !== 'draft');
const status = computed(() => props.t.status[state.value].replace('{number}', number.value));

function change(product: number, by: 1 | -1) {
  qty.value[product] = Math.min(MAX_QTY, Math.max(0, qty.value[product] + by));
}

function pick(i: number) {
  if (i === customer.value) return;
  customer.value = i;
  emit('step', 'customer');
}

function send() {
  // El número se asigna al enviar, no antes.
  number.value = `COT-2026-${String(nextNumber++).padStart(6, '0')}`;
  state.value = 'sent';
  emit('step', 'send');
}

function approve() {
  state.value = 'approved';
  orders.value++;
  sold.value += totals.value.total;
  emit('step', 'approve');
}

function reset() {
  qty.value = [...START];
  discount.value = 0;
  number.value = '';
  state.value = 'draft';
}
</script>

<template>
  <div class="demo quote">
    <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
    <div class="demo__bar">
      <span id="demo-quote-customer" class="mono">{{ t.customerLabel }}</span>
      <div class="demo__group" role="group" aria-labelledby="demo-quote-customer">
        <button
          v-for="(option, i) in quoteCustomers"
          :key="option.name"
          class="chip"
          type="button"
          :aria-pressed="customer === i"
          :disabled="locked"
          :class="{ 'is-hint': hint === 'customer' && !locked && customer !== i }"
          @click="pick(i)"
        >
          {{ option.name }}
        </button>
      </div>
    </div>
    <div class="quote__body">
      <section class="quote__build" :aria-label="t.builder">
        <h3 class="mono quote__head">{{ t.builder }}</h3>
        <ul class="quote__items">
          <li v-for="(product, i) in quoteProducts" :key="product.sku">
            <span class="quote__name">{{ t.products[i] }}</span>
            <span class="quote__step">
              <button type="button" :aria-label="named(t.less, i)" :disabled="locked || qty[i] === 0" @click="change(i, -1)">
                −
              </button>
              <output :aria-label="named(t.qty, i)">{{ qty[i] }}</output>
              <button
                type="button"
                :aria-label="named(t.more, i)"
                :disabled="locked || qty[i] === MAX_QTY"
                @click="change(i, 1)"
              >
                +
              </button>
            </span>
          </li>
        </ul>
        <div class="quote__discount">
          <span id="demo-quote-discount" class="mono">{{ t.discountLabel }}</span>
          <div class="demo__group" role="group" aria-labelledby="demo-quote-discount">
            <button
              v-for="option in discounts"
              :key="option"
              class="chip"
              type="button"
              :aria-pressed="discount === option"
              :disabled="locked"
              @click="discount = option"
            >
              {{ option === 0 ? t.noDiscount : `${option} %` }}
            </button>
          </div>
        </div>
      </section>
      <section class="quote__doc" :data-state="state" :aria-label="t.docTitle">
        <header class="quote__top">
          <div>
            <p class="quote__company">{{ t.company }}</p>
            <p class="quote__for">
              {{ t.forLabel }}: <b>{{ quoteCustomers[customer].name }}</b> ·
              {{ t.lists[quoteCustomers[customer].list] }}
            </p>
          </div>
          <p class="quote__number">
            <span>{{ t.docTitle }}</span>
            <b>{{ number || t.draftNumber }}</b>
          </p>
        </header>
        <table class="quote__table">
          <thead>
            <tr>
              <th scope="col">{{ t.colItem }}</th>
              <th scope="col" class="num">{{ t.colQty }}</th>
              <th scope="col" class="num">{{ t.colPrice }}</th>
              <th scope="col" class="num">{{ t.colTotal }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in totals.lines" :key="line.product">
              <td>{{ t.products[line.product] }}</td>
              <td class="num">{{ line.qty }}</td>
              <td class="num">{{ money(line.unit) }}</td>
              <td class="num">{{ money(line.total) }}</td>
            </tr>
            <tr v-if="totals.lines.length === 0">
              <td class="quote__empty" colspan="4">{{ t.empty }}</td>
            </tr>
          </tbody>
        </table>
        <dl class="quote__sums" role="status" aria-live="polite">
          <template v-if="totals.discount > 0">
            <div>
              <dt>{{ t.subtotal }}</dt>
              <dd>{{ money(totals.subtotal) }}</dd>
            </div>
            <div>
              <dt>{{ t.discount }}</dt>
              <dd>− {{ money(totals.discount) }}</dd>
            </div>
          </template>
          <div class="quote__grand">
            <dt>{{ t.total }}</dt>
            <dd>{{ money(totals.total) }}</dd>
          </div>
        </dl>
        <p v-if="state !== 'draft'" class="quote__seal" aria-hidden="true">{{ t.states[state] }}</p>
      </section>
    </div>
    <div class="quote__foot">
      <ol class="quote__steps" :aria-label="t.statesLabel">
        <li
          v-for="(step, i) in quoteStates"
          :key="step"
          :data-done="quoteStates.indexOf(state) >= i"
          :aria-current="state === step ? 'step' : undefined"
        >
          {{ t.states[step] }}
        </li>
      </ol>
      <p class="quote__status" role="status" aria-live="polite">
        {{ status }}
        <span v-if="orders > 0"
          >{{ t.orders.replace('{n}', String(orders)) }} · {{ t.sold.replace('{sum}', money(sold)) }}</span
        >
      </p>
      <button
        v-if="state === 'draft'"
        class="chip chip--go"
        type="button"
        :class="{ 'is-hint': hint === 'send' }"
        :disabled="totals.lines.length === 0"
        @click="send"
      >
        {{ t.send }}
      </button>
      <button
        v-else-if="state === 'sent'"
        class="chip chip--go"
        type="button"
        :class="{ 'is-hint': hint === 'approve' }"
        @click="approve"
      >
        {{ t.approve }}
      </button>
      <button v-else class="chip chip--go" type="button" :class="{ 'is-hint': hint !== undefined }" @click="reset">{{ t.reset }}</button>
    </div>
  </div>
</template>
