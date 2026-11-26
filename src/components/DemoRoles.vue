<script setup lang="ts">
// Matriz de permisos por rol. Al pulsar una casilla responde como lo haría el
// servidor: 200 si el rol puede, 403 si no. Lleva su propia misión de tres
// pasos (que te nieguen algo, entrar como administrador y lograrlo), con el
// mismo trato que las demos en pestañas. Los datos son ficticios
// (src/data/demo.ts) y los textos llegan por props.
import { computed, onBeforeUnmount, ref } from 'vue';
import { actions, modules, permissions, roles, type Action, type Module, type Role } from '../data/demo';
import { ROLE_EVENT } from '../lib/events';

type Step = 'deny' | 'admin' | 'allow';
interface Cell {
  module: Module;
  action: Action;
}

interface Texts {
  caption: string;
  enterAs: string;
  roles: Record<Role, string>;
  module: string;
  modules: Record<Module, string>;
  actions: Record<Action, string>;
  cell: string;
  yes: string;
  no: string;
  session: string;
  allowed: string;
  denied: string;
  // La misión: papel, pasos (rótulo y pista), remate y palabras comunes.
  role: string;
  steps: Record<Step, { label: string; hint: string }>;
  win: string;
  quote: string;
  note: string;
  lab: { mission: string; done: string; todo: string; complete: string; want: string };
}

const props = defineProps<{ t: Texts; stamp: string }>();

const steps: Step[] = ['deny', 'admin', 'allow'];
// El rol con el que se entra y la casilla que se propone intentar primero:
// algo que ese rol no puede y el administrador sí.
const START: Role = 'seller';
const FIRST: Cell = { module: 'customers', action: 'delete' };

const root = ref<HTMLElement>();
const role = ref<Role>(START);
const attempt = ref<Cell | null>(null);
const flash = ref('');
let flashTimer = 0;

const done = ref<Step[]>([]);
// La última casilla que el servidor negó: es la que se propone repetir.
const refused = ref<Cell | null>(null);
const cheer = ref(false);
let cheerTimer = 0;

const allows = (who: Role, { module, action }: Cell) => permissions[who][module].includes(action);
const can = (module: Module, action: Action) => allows(role.value, { module, action });
const same = (a: Cell | null, module: Module, action: Action) => a?.module === module && a.action === action;

const pending = computed(() => steps.find((step) => !done.value.includes(step)));
const won = computed(() => done.value.length === steps.length);
// La casilla que cumple el paso de repetir: la negada, si el administrador puede.
const retry = computed(() => (refused.value && allows('admin', refused.value) ? refused.value : FIRST));

function mark(step: Step) {
  if (done.value.includes(step)) return;
  done.value.push(step);
  if (!won.value) return;
  cheer.value = true;
  window.clearTimeout(cheerTimer);
  cheerTimer = window.setTimeout(() => (cheer.value = false), 1200);
}

// El guiño va en el control que cumple el paso pendiente.
function hintRole(option: Role) {
  if (pending.value === 'admin' || pending.value === 'allow') return option === 'admin' && role.value !== 'admin';
  // Para que le nieguen algo hay que salir de la sesión de administrador.
  return pending.value === 'deny' && role.value === 'admin' && option === START;
}
function hintCell(module: Module, action: Action) {
  if (pending.value === 'deny') return role.value !== 'admin' && same(FIRST, module, action);
  return pending.value === 'allow' && role.value === 'admin' && same(retry.value, module, action);
}

function fill(text: string, module: Module, action: Action) {
  return text
    .replace('{role}', props.t.roles[role.value])
    .replace('{action}', props.t.actions[action].toLowerCase())
    .replace('{module}', props.t.modules[module]);
}

const result = computed(() => {
  const tried = attempt.value;
  if (!tried) return { code: '200', text: props.t.session.replace('{role}', props.t.roles[role.value]) };
  return can(tried.module, tried.action)
    ? { code: '200', text: fill(props.t.allowed, tried.module, tried.action) }
    : { code: '403', text: fill(props.t.denied, tried.module, tried.action) };
});

function cellLabel(module: Module, action: Action) {
  return props.t.cell
    .replace('{action}', props.t.actions[action])
    .replace('{module}', props.t.modules[module])
    .replace('{state}', can(module, action) ? props.t.yes : props.t.no);
}

function enterAs(next: Role) {
  role.value = next;
  attempt.value = null;
  if (next === 'admin') mark('admin');
  // La escena escucha este evento para cambiar la pose del personaje.
  root.value?.dispatchEvent(new CustomEvent(ROLE_EVENT, { bubbles: true, detail: { role: next } }));
}

function request(module: Module, action: Action) {
  attempt.value = { module, action };
  flash.value = `${module}:${action}`;
  window.clearTimeout(flashTimer);
  flashTimer = window.setTimeout(() => (flash.value = ''), 500);
  if (!can(module, action)) {
    refused.value = { module, action };
    mark('deny');
  } else if (role.value === 'admin' && !allows(START, { module, action })) {
    // El administrador logra lo que al rol de entrada se le niega.
    mark('allow');
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(flashTimer);
  window.clearTimeout(cheerTimer);
});
</script>

<template>
  <div ref="root" class="lab">
    <div class="lab__brief" :data-won="won">
      <span class="mono lab__role">{{ t.role }}</span>
      <ol v-if="!won" class="lab__steps" :aria-label="t.lab.mission">
        <li
          v-for="step in steps"
          :key="step"
          class="lab__step"
          :data-done="done.includes(step)"
          :aria-current="pending === step ? 'step' : undefined"
        >
          <span class="lab__box" aria-hidden="true">{{ done.includes(step) ? '✓' : '' }}</span>
          {{ t.steps[step].label }}
          <span class="visually-hidden">({{ done.includes(step) ? t.lab.done : t.lab.todo }})</span>
        </li>
      </ol>
      <p class="lab__win" role="status" aria-live="polite">
        <template v-if="won">{{ t.win }}</template>
      </p>
      <a v-if="won" class="chip chip--go lab__want" href="#contact" :data-quote="t.quote">{{ t.lab.want }}</a>
    </div>
    <div class="lab__panel" :class="{ 'is-cheer': cheer }">
      <div class="demo">
        <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
        <div class="demo__bar">
          <span id="demo-roles-enter" class="mono">{{ t.enterAs }}</span>
          <div class="demo__group" role="group" aria-labelledby="demo-roles-enter">
            <button
              v-for="option in roles"
              :key="option"
              class="chip"
              type="button"
              :class="{ 'is-hint': hintRole(option) }"
              :aria-pressed="role === option"
              @click="enterAs(option)"
            >
              {{ t.roles[option] }}
            </button>
          </div>
        </div>
        <div class="demo__scroll">
          <table>
            <caption class="visually-hidden">
              {{ t.caption }}
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span>{{ t.module }}</span>
                </th>
                <th v-for="action in actions" :key="action" scope="col" class="center">
                  <span>{{ t.actions[action] }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="module in modules" :key="module">
                <td role="rowheader">{{ t.modules[module] }}</td>
                <td v-for="action in actions" :key="action" class="demo__perm">
                  <button
                    class="demo__cell"
                    type="button"
                    :class="{ 'is-flash': flash === `${module}:${action}`, 'is-hint': hintCell(module, action) }"
                    :data-ok="can(module, action)"
                    :aria-label="cellLabel(module, action)"
                    @click="request(module, action)"
                  >
                    <span class="demo__key" aria-hidden="true">{{ can(module, action) ? '✓' : '—' }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="demo__result" role="status" aria-live="polite">
          <b class="demo__code" :data-code="result.code">{{ result.code }}</b>
          <span>{{ result.text }}</span>
        </p>
      </div>
    </div>
    <p class="note hand sheet__note">{{ pending ? t.steps[pending].hint : t.note }}</p>
  </div>
</template>
