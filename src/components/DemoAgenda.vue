<script setup lang="ts">
// Agenda de un día en una clínica. El visitante reserva en una franja libre
// (el sistema rechaza los cruces y lo que se pasa del horario) y después
// atiende la cita: en ese momento sale el insumo del inventario y, si queda
// bajo el mínimo, aparece la alerta. Nada sale del navegador: los datos son
// ficticios (src/data/demo-agenda.ts) y los textos llegan por props.
import { computed, ref } from 'vue';
import {
  SLOTS,
  SLOT_MIN,
  checkSlot,
  dayStart,
  freeSlots,
  occupancy,
  pros,
  serviceInfo,
  services,
  stockStart,
  supplies,
  timeOf,
  walkIns,
  type Appointment,
  type Service,
  type Supply,
} from '../data/demo-agenda';

interface Texts {
  caption: string;
  serviceLabel: string;
  services: Record<Service, string>;
  supplies: Record<Supply, string>;
  minutes: string;
  reset: string;
  time: string;
  inventory: string;
  min: string;
  low: string;
  free: string;
  done: string;
  freeLabel: string;
  apptLabel: string;
  states: { booked: string; done: string };
  idle: string;
  booked: string;
  busy: string;
  closed: string;
  completed: string;
  completedLow: string;
  already: string;
  noStock: string;
  footAppts: string;
  footBusy: string;
  footAlerts: string;
}

// `hint`: el paso de la misión que sigue; el control que lo cumple lleva el guiño.
const props = defineProps<{ t: Texts; stamp: string; hint?: string }>();
const emit = defineEmits<{ step: [key: string] }>();

const freshStock = () =>
  Object.fromEntries(supplies.map((id) => [id, stockStart[id].stock])) as Record<Supply, number>;

const service = ref<Service>('facial');
const day = ref<Appointment[]>(dayStart.map((a) => ({ ...a })));
const stock = ref(freshStock());
const result = ref<{ code: string; text: string } | null>(null);
// La casilla que acaba de responder, para el destello.
const flash = ref('');
let flashTimer = 0;
let booked = 0;
let nextId = dayStart.length + 1;

// El servicio más largo: el que más fácil se cruza con otra cita.
const LONG: Service = 'laser';
// Las citas que al atenderse dejan un insumo bajo el mínimo: las que señala la misión.
const tips = (appt: Appointment) => {
  const { supply, qty } = serviceInfo[appt.service];
  return !appt.done && stock.value[supply] >= qty && stock.value[supply] - qty < stockStart[supply].min;
};
// La primera franja libre de la agenda, para señalarla al empezar.
const firstFree = computed(() => {
  for (let p = 0; p < pros.length; p++) {
    const free = freeSlots(day.value, p);
    if (free.length) return `${p}-${free[0]}`;
  }
  return '';
});

const minutes = (kind: Service) => props.t.minutes.replace('{n}', String(serviceInfo[kind].slots * SLOT_MIN));
const isLow = (id: Supply) => stock.value[id] < stockStart[id].min;
const alerts = computed(() => supplies.filter(isLow).length);

function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

function tell(code: string, text: string, cell: string) {
  result.value = { code, text };
  flash.value = cell;
  window.clearTimeout(flashTimer);
  flashTimer = window.setTimeout(() => (flash.value = ''), 500);
}

// La franja que lleva el guiño: la primera libre para reservar o, ya con el
// servicio largo elegido, las que se cruzan con otra cita.
function hintSlot(pro: number, slot: number) {
  if (props.hint === 'book') return firstFree.value === `${pro}-${slot}`;
  return props.hint === 'clash' && service.value === LONG && checkSlot(day.value, pro, slot, LONG) === 'busy';
}

// Reservar: el servidor revisa el horario de la sede y los cruces.
function book(pro: number, start: number) {
  const kind = service.value;
  const values = {
    pro: pros[pro],
    time: timeOf(start),
    service: props.t.services[kind],
    n: serviceInfo[kind].slots * SLOT_MIN,
  };
  const check = checkSlot(day.value, pro, start, kind);
  if (check !== 'ok') {
    tell('409', fill(check === 'busy' ? props.t.busy : props.t.closed, values), `f${pro}-${start}`);
    if (check === 'busy') emit('step', 'clash');
    return;
  }
  const patient = walkIns[booked++ % walkIns.length];
  const id = nextId++;
  day.value.push({ id, pro, start, service: kind, patient, done: false });
  tell('201', fill(props.t.booked, { ...values, patient }), `a${id}`);
  emit('step', 'book');
}

// Atender: al completar la cita sale el insumo. Nunca queda en negativo.
function complete(appt: Appointment) {
  const cell = `a${appt.id}`;
  if (appt.done) {
    tell('200', props.t.already, cell);
    return;
  }
  const { supply, qty } = serviceInfo[appt.service];
  const values = { qty, supply: props.t.supplies[supply] };
  if (stock.value[supply] < qty) {
    tell('400', fill(props.t.noStock, values), cell);
    return;
  }
  stock.value[supply] -= qty;
  appt.done = true;
  tell('200', fill(isLow(supply) ? props.t.completedLow : props.t.completed, values), cell);
  if (isLow(supply)) emit('step', 'alert');
}

function reset() {
  day.value = dayStart.map((a) => ({ ...a }));
  stock.value = freshStock();
  result.value = null;
  booked = 0;
  nextId = dayStart.length + 1;
}

function apptLabel(appt: Appointment) {
  return fill(props.t.apptLabel, {
    pro: pros[appt.pro],
    time: timeOf(appt.start),
    service: props.t.services[appt.service],
    patient: appt.patient,
    state: appt.done ? props.t.states.done : props.t.states.booked,
  });
}

function freeLabel(pro: number, slot: number) {
  return fill(props.t.freeLabel, { pro: pros[pro], time: timeOf(slot), service: props.t.services[service.value] });
}

// Ancho de la barra de existencia, contra la existencia inicial.
const level = (id: Supply) => `${(stock.value[id] / stockStart[id].stock) * 100}%`;
</script>

<template>
  <div class="demo">
    <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
    <div class="demo__bar">
      <span id="demo-agenda-service" class="mono">{{ t.serviceLabel }}</span>
      <div class="demo__group" role="group" aria-labelledby="demo-agenda-service">
        <button
          v-for="kind in services"
          :key="kind"
          class="chip"
          type="button"
          :aria-pressed="service === kind"
          :class="{ 'is-hint': hint === 'clash' && kind === LONG && service !== LONG }"
          @click="service = kind"
        >
          {{ t.services[kind] }} · {{ minutes(kind) }}
        </button>
      </div>
      <button class="chip agenda__reset" type="button" @click="reset">{{ t.reset }}</button>
    </div>
    <div class="agenda">
      <div class="agenda__scroll">
        <div class="agenda__day" role="group" :aria-label="t.caption" :style="`--slots:${SLOTS}`">
          <span class="agenda__head">{{ t.time }}</span>
          <span v-for="(pro, p) in pros" :key="pro" class="agenda__head" :style="`grid-column:${p + 2}`">
            {{ pro }}
          </span>
          <span
            v-for="slot in SLOTS"
            :key="`t${slot}`"
            class="agenda__time"
            :style="`grid-row:${slot + 1}`"
            aria-hidden="true"
          >
            {{ timeOf(slot - 1) }}
          </span>
          <template v-for="(pro, p) in pros" :key="`p${pro}`">
            <button
              v-for="slot in freeSlots(day, p)"
              :key="`f${p}-${slot}`"
              class="agenda__slot"
              type="button"
              :class="{ 'is-no': flash === `f${p}-${slot}`, 'is-hint': hintSlot(p, slot) }"
              :style="`grid-column:${p + 2};grid-row:${slot + 2}`"
              :aria-label="freeLabel(p, slot)"
              @click="book(p, slot)"
            >
              {{ t.free }}
            </button>
          </template>
          <button
            v-for="appt in day"
            :key="`a${appt.id}`"
            class="agenda__appt"
            type="button"
            :class="{ 'is-flash': flash === `a${appt.id}`, 'is-hint': hint === 'alert' && tips(appt) }"
            :data-done="appt.done"
            :style="`grid-column:${appt.pro + 2};grid-row:${appt.start + 2} / span ${serviceInfo[appt.service].slots}`"
            :aria-label="apptLabel(appt)"
            @click="complete(appt)"
          >
            <b>{{ appt.patient }}</b>
            <span>{{ appt.done ? t.done : t.services[appt.service] }}</span>
          </button>
        </div>
      </div>
      <section class="agenda__stock" :aria-label="t.inventory">
        <h3 class="mono agenda__title">{{ t.inventory }}</h3>
        <ul>
          <li v-for="id in supplies" :key="id" class="agenda__item" :data-low="isLow(id)">
            <span class="agenda__name">{{ t.supplies[id] }}</span>
            <b class="agenda__qty">{{ stock[id] }}</b>
            <span class="agenda__bar" aria-hidden="true"><i :style="{ width: level(id) }"></i></span>
            <span class="agenda__min">
              {{ isLow(id) ? t.low : t.min.replace('{n}', String(stockStart[id].min)) }}
            </span>
          </li>
        </ul>
      </section>
    </div>
    <p class="demo__result agenda__result" role="status" aria-live="polite">
      <template v-if="result">
        <b class="demo__code" :data-bad="result.code.startsWith('4')">{{ result.code }}</b>
        <span>{{ result.text }}</span>
      </template>
      <span v-else class="agenda__idle">{{ t.idle }}</span>
    </p>
    <p class="demo__foot">
      <span>
        {{ t.footAppts.replace('{n}', String(day.length)) }} ·
        {{ t.footBusy.replace('{p}', String(occupancy(day))) }}
      </span>
      <span :class="{ agenda__warn: alerts > 0 }">{{ t.footAlerts.replace('{n}', String(alerts)) }}</span>
    </p>
  </div>
</template>
