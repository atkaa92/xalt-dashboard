<template>
  <BaseButton
    @click="handleAddAsset"
    class="flex flex-wrap justify-end items-center gap-2 text-yellowish mb-3"
  >
    Add Asset
  </BaseButton>
  <div v-if="loading">Loading events...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <Table
    v-if="events.length"
    :columns="columns"
    :rows="events"
    :initial-sort="{ key: 'id', dir: 'asc' }"
    row-key-field="id"
  >
    <template #cell:id="{ row }">
      <div class="flex items-center gap-2">
        <span class="font-medium capitalize">ID: {{ row.id }}</span>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import Table from '@/components/ui/Table.vue';
import { useEventsStore } from '@/stores/event.ts';
import type { Column } from '@/utilities/types';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const store = useEventsStore();
const router = useRouter();
const { events, loading, error } = storeToRefs(store);

const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    align: 'start',
    noWrap: true,
  },
  { key: 'title', label: 'Name', width: '65%' },
  { key: 'userId', label: 'User_ID', width: '5%', align: 'center' },
];

const handleAddAsset = async () => {
  router.push('/add-assets');
};

onMounted(() => store.fetchEvents());
onUnmounted(() => store.reset());
</script>
