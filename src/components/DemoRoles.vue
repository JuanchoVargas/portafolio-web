<script setup lang="ts">
// Matriz de permisos por rol. Al pulsar una casilla responde como lo haría el
// servidor: 200 si el rol puede, 403 si no. Los datos son ficticios
// (src/data/demo.ts) y los textos llegan por props.
import { computed, ref } from 'vue';
import { actions, modules, permissions, roles, type Action, type Module, type Role } from '../data/demo';
import { ROLE_EVENT } from '../lib/events';

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
}

const props = defineProps<{ t: Texts; stamp: string }>();

const root = ref<HTMLElement>();
const role = ref<Role>('seller');
const attempt = ref<{ module: Module; action: Action } | null>(null);
const flash = ref('');
let flashTimer = 0;

const can = (module: Module, action: Action) => permissions[role.value][module].includes(action);

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
  // La escena escucha este evento para cambiar la pose del personaje.
  root.value?.dispatchEvent(new CustomEvent(ROLE_EVENT, { bubbles: true, detail: { role: next } }));
}

function request(module: Module, action: Action) {
  attempt.value = { module, action };
  flash.value = `${module}:${action}`;
  window.clearTimeout(flashTimer);
  flashTimer = window.setTimeout(() => (flash.value = ''), 500);
}
</script>

<template>
  <div ref="root" class="demo">
    <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
    <div class="demo__bar">
      <span id="demo-roles-enter" class="mono">{{ t.enterAs }}</span>
      <div class="demo__group" role="group" aria-labelledby="demo-roles-enter">
        <button
          v-for="option in roles"
          :key="option"
          class="chip"
          type="button"
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
                :class="{ 'is-flash': flash === `${module}:${action}` }"
                :data-ok="can(module, action)"
                :aria-label="cellLabel(module, action)"
                @click="request(module, action)"
              >
                {{ can(module, action) ? '✓' : '—' }}
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
</template>
