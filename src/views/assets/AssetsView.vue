<template>
  <BaseButton
    @click="handleAddAsset"
    class="flex flex-wrap justify-end items-center gap-2 text-yellowish mb-3"
  >
    Add Asset
  </BaseButton>
  <div v-if="loading">Loading assets...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <Table
    v-if="assets?.length"
    :columns="columns"
    :rows="assets"
    :initial-sort="{ key: 'id', dir: 'asc' }"
    row-key-field="id"
  >
    <template #cell:id="{ row }">
      <div class="flex items-center gap-2">
        <span class="font-medium capitalize">ID: {{ row.id }}</span>
      </div>
    </template>
    <template #cell:type="{ row }">
      {{ row.attributes?.type }}
    </template>
    <template #cell:createdAt="{ row }">
      {{ new Date(row.createdAt).toLocaleDateString() }}
    </template>
  </Table>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import Table from '@/components/ui/Table.vue';
import { useAssetStore } from '@/stores/asset';
import type { Column } from '@/types';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const store = useAssetStore();
const router = useRouter();
const { assets, loading, error } = storeToRefs(store);

const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    align: 'start',
    noWrap: true,
  },
  { key: 'name', label: 'Name', width: '55%' },
  { key: 'type', label: 'Type', width: '10%', align: 'center' },
  { key: 'createdAt', label: 'Created At', width: '20%', align: 'center' },
];

const handleAddAsset = async () => {
  router.push('/add-assets');
};

onMounted(() => store.fetchAssets());
</script>
