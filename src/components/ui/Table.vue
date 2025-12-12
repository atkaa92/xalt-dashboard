<template>
  <div class="rounded-xl bg-white/5 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-fg">
        <!-- Sticky header -->
        <thead
          class="bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 sticky top-0"
        >
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              @click="toggleSort(col.key)"
              class="px-4 py-3 text-left font-semibold tracking-wide select-none cursor-pointer"
              :class="
                (col.headerClass,
                {
                  'text-left': col.align === 'start' || !col.align,
                  'text-center': col.align === 'center',
                  'text-right': col.align === 'end',
                })
              "
              :style="col.width ? { width: col.width } : undefined"
            >
              <div class="inline-flex items-center gap-1">
                <span>{{ col.label }}</span>
                <svg
                  v-if="sort.key === col.key"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path v-if="sort.dir === 'asc'" d="M7 14l5-5 5 5" />
                  <path v-else d="M7 10l5 5 5-5" />
                </svg>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Loading -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-10 text-center text-slate-400">
              <span class="inline-flex items-center gap-2">
                <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    class="opacity-25"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                  />
                </svg>
                Loading…
              </span>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-else-if="sortedRows.length === 0">
            <td :colspan="columns.length" class="px-4 py-10 text-center text-slate-400">
              No data to display
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="(row, i) in sortedRows"
            :key="rowKey(row, i)"
            class="even:bg-slate-900/20 hover:bg-slate-900/40 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3"
              :class="
                (col.cellClass,
                {
                  'whitespace-nowrap truncate': col.noWrap === true,
                  'text-left': col.align === 'start' || !col.align,
                  'text-center': col.align === 'center',
                  'text-right': col.align === 'end',
                })
              "
              :style="col.width ? { width: col.width } : undefined"
            >
              <slot :name="`cell:${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column, SortState } from '@/types';
import { computed, reactive } from 'vue';

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Array<Record<string, any>>;
  columns: Column[];
  initialSort?: SortState;
  loading?: boolean;
  rowKeyField?: string;
}

const props = defineProps<TableProps>();

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const sort = reactive<{ key: string; dir: 'asc' | 'desc' }>(
  props.initialSort ?? { key: props.columns[0]?.key ?? '', dir: 'asc' },
);

function toggleSort(key: string) {
  if (!key) return;
  if (sort.key === key) {
    sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sort.key = key;
    sort.dir = 'asc';
  }
}

const sortedRows = computed(() => {
  if (!sort.key) return props.rows ?? [];
  const copy = [...(props.rows ?? [])];
  copy.sort((a, b) => {
    const av = a?.[sort.key];
    const bv = b?.[sort.key];
    // string + number friendly compare
    const ax = typeof av === 'string' ? av.toLowerCase() : av;
    const bx = typeof bv === 'string' ? bv.toLowerCase() : bv;
    if (ax === null && bx === null) return 0;
    if (ax === null) return sort.dir === 'asc' ? 1 : -1;
    if (bx === null) return sort.dir === 'asc' ? -1 : 1;
    if (ax < bx) return sort.dir === 'asc' ? -1 : 1;
    if (ax > bx) return sort.dir === 'asc' ? 1 : -1;
    return 0;
  });
  return copy;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowKey(row: Record<string, any>, i: number) {
  return props.rowKeyField ? (row[props.rowKeyField] ?? i) : i;
}
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}
thead th:first-child {
  border-top-left-radius: 12px;
}
thead th:last-child {
  border-top-right-radius: 12px;
}
</style>
