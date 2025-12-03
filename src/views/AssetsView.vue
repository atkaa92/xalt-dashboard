<template>
  <div v-if="loading">Loading users...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <Table
    v-if="users.length"
    :columns="columns"
    :rows="users"
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
import Table from '@/components/ui/Table.vue';
import { useUserStore } from '@/stores/user';
import type { Column } from '@/utilities/types';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

const store = useUserStore();
const { users, loading, error } = storeToRefs(store);
const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    align: 'start',
    noWrap: true,
  },
  { key: 'name', label: 'Name', width: '65%' },
  { key: 'email', label: 'E-mail', width: '65%' },
  { key: 'phone', label: 'Phone', width: '65%', noWrap: true },
];

onMounted(() => store.fetchUsers());
onUnmounted(() => store.reset());
</script>
