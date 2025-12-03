<template>
  <div>
    <div v-if="loading">Loading events...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <Table
      v-if="events"
      class="overflow-y-auto"
      :columns="columns"
      :rows="events"
      :initial-sort="{ key: 'id', dir: 'asc' }"
      row-key-field="id"
    >
      <template #cell:title="{ row }">
        <div class="flex items-center gap-2">
          <span class="font-medium capitalize">{{ row.title }}</span>
          <span
            v-if="row.id % 3 === 1"
            class="inline-flex h-2.5 w-2.5 rounded-full bg-red-700"
          ></span>
          <span v-if="row.id % 3 === 1" class="text-red-700 font-bold">LIVE</span>
        </div>
      </template>
      <template #cell:actions="{ row }">
        <div class="flex gap-2 items-center justify-end">
          <div class="p-2 bg-button flex rounded-md cursor-pointer">
            <Trash class="text-yellowish w-5 h-5 shrink-0" />
          </div>
          <div class="p-2 bg-button flex rounded-md cursor-pointer">
            <Pen class="text-yellowish w-5 h-5 shrink-0" />
          </div>
          <div class="p-2 bg-button flex rounded-md cursor-pointer">
            <Settings2 class="text-yellowish w-5 h-5 shrink-0" />
          </div>
          <RoundedButton
            @click="console.log(row.id)"
            class="flex flex-wrap justify-end items-center gap-2 text-yellowish"
          >
            Assets
          </RoundedButton>
          <RoundedButton class="flex flex-wrap justify-end items-center gap-2 text-yellowish">
            Metrics
          </RoundedButton>
          <RoundedButton class="flex flex-wrap justify-end items-center gap-2 text-yellowish">
            Survays
          </RoundedButton>
          <div class="p-2 bg-button flex rounded-md cursor-pointer">
            <AudioLines class="text-yellowish w-5 h-5 shrink-0" />
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import RoundedButton from '@/components/ui/RoundedButton.vue';

import Table from '@/components/ui/Table.vue';
import { useAxios } from '@/composables/useAxios';
import type { Column, Event } from '@/utilities/types';
import { AudioLines, Pen, Settings2, Trash } from 'lucide-vue-next';
import { onMounted } from 'vue';
const { data: events, error, loading, fetchData: fetchEvents } = useAxios<Event[]>('/albums');

const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    headerClass: 'w-16 text-slate-400 justify-start',
    cellClass: 'text-slate-300',
    width: '5%',
    align: 'center',
  },
  { key: 'title', label: 'Title', width: '25%', noWrap: true },
  { key: 'userId', label: 'Role', width: '5%', align: 'center' },
  { key: 'actions', label: '', width: '65%' },
];

onMounted(fetchEvents);
</script>
