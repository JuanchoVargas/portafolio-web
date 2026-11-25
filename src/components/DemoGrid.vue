<script setup lang="ts">
// Grilla de oportunidades: ordena por columna, filtra por etapa y busca.
// Los datos son ficticios (src/data/demo.ts) y los textos llegan por props.
import { computed, ref } from 'vue';
import { opportunities, stages, type Opportunity, type Stage } from '../data/demo';

type Column = keyof Opportunity;

interface Texts {
  caption: string;
  search: string;
  searchLabel: string;
  filterLabel: string;
  all: string;
  stages: Record<Stage, string>;
  columns: Record<Column, string>;
  count: string;
  total: string;
  empty: string;
  thousands: string;
}

const props = defineProps<{ t: Texts; lang: string; stamp: string }>();

const columns: Column[] = ['client', 'stage', 'value', 'owner', 'date'];
// Columnas de cifras: van alineadas a la derecha.
const numeric: Column[] = ['value', 'date'];

const query = ref('');
const filter = ref<Stage | null>(null);
const sort = ref<{ by: Column; dir: 1 | -1 }>({ by: 'value', dir: -1 });

function compare(a: Opportunity, b: Opportunity, by: Column): number {
  if (by === 'value') return a.value - b.value;
  // Las etapas se ordenan como avanza una venta, no por abecedario.
  if (by === 'stage') return stages.indexOf(a.stage) - stages.indexOf(b.stage);
  return a[by].localeCompare(b[by], props.lang);
}

const rows = computed(() => {
  const q = query.value.trim().toLowerCase();
  const { by, dir } = sort.value;
  return opportunities
    .filter((row) => !filter.value || row.stage === filter.value)
    .filter((row) => !q || `${row.client} ${row.owner}`.toLowerCase().includes(q))
    .sort((a, b) => compare(a, b, by) * dir);
});

function sortBy(by: Column) {
  sort.value = { by, dir: sort.value.by === by && sort.value.dir === 1 ? -1 : 1 };
}

function ariaSort(column: Column) {
  if (sort.value.by !== column) return 'none';
  return sort.value.dir === 1 ? 'ascending' : 'descending';
}

const money = (n: number) => `$ ${String(n).replace(/\B(?=(\d{3})+$)/g, props.t.thousands)}`;

const count = computed(() =>
  props.t.count.replace('{n}', String(rows.value.length)).replace('{total}', String(opportunities.length)),
);
const total = computed(() =>
  props.t.total.replace('{sum}', money(rows.value.reduce((sum, row) => sum + row.value, 0))),
);
</script>

<template>
  <div class="demo">
    <p class="stamp stamp--sm demo__stamp">{{ stamp }}</p>
    <div class="demo__bar">
      <input v-model="query" class="demo__search" type="search" :placeholder="t.search" :aria-label="t.searchLabel" />
      <div class="demo__group" role="group" :aria-label="t.filterLabel">
        <button class="chip" type="button" :aria-pressed="filter === null" @click="filter = null">
          {{ t.all }}
        </button>
        <button
          v-for="stage in stages"
          :key="stage"
          class="chip"
          type="button"
          :aria-pressed="filter === stage"
          @click="filter = stage"
        >
          {{ t.stages[stage] }}
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
            <th
              v-for="column in columns"
              :key="column"
              scope="col"
              :class="{ num: numeric.includes(column) }"
              :aria-sort="ariaSort(column)"
            >
              <button class="demo__sort" type="button" @click="sortBy(column)">
                {{ t.columns[column] }}
                <span class="demo__arrow" aria-hidden="true">{{
                  sort.by !== column ? '' : sort.dir === 1 ? '↑' : '↓'
                }}</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.client">
            <td>{{ row.client }}</td>
            <td>
              <span class="demo__stage" :data-stage="row.stage">{{ t.stages[row.stage] }}</span>
            </td>
            <td class="num">{{ money(row.value) }}</td>
            <td>{{ row.owner }}</td>
            <td class="num">{{ row.date }}</td>
          </tr>
          <tr v-if="rows.length === 0">
            <td class="demo__empty" :colspan="columns.length">{{ t.empty }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="demo__foot" role="status" aria-live="polite">
      <span>{{ count }}</span>
      <span>{{ total }}</span>
    </p>
  </div>
</template>
