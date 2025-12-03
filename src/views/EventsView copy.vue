<template>
  <div>
    <BaseButton
      @click="open"
      class="flex flex-wrap justify-end items-center gap-2 text-yellowish mb-3"
    >
      Add Event
    </BaseButton>

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
          <BaseButton
            @click="console.log(row.id)"
            class="flex flex-wrap justify-end items-center gap-2 text-yellowish"
          >
            Assets
          </BaseButton>
          <BaseButton class="flex flex-wrap justify-end items-center gap-2 text-yellowish">
            Metrics
          </BaseButton>
          <BaseButton class="flex flex-wrap justify-end items-center gap-2 text-yellowish">
            Survays
          </BaseButton>
          <div class="p-2 bg-button flex rounded-md cursor-pointer">
            <AudioLines class="text-yellowish w-5 h-5 shrink-0" />
          </div>
        </div>
      </template>
    </Table>
  </div>

  <BaseModal v-model="isOpen" :close-on-esc="true" :close-on-backdrop="true" title="Add Event">
    <div>
      <BaseInput v-model="name" label="Name" type="text" />
    </div>
    <template #footer>
      <button
        class="rounded-lg border border-gray-500 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
        @click="close"
      >
        Cancel
      </button>

      <button
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        @click="handleAction"
      >
        Confirm
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import Table from '@/components/ui/Table.vue';
import { useAxios } from '@/composables/useAxios';
import { useModal } from '@/composables/useModal';
import type { Column, Event } from '@/utilities/types';
import { AudioLines, Pen, Settings2, Trash } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
const {
  data: events,
  error,
  loading,
  fetchData: fetchEvents,
  postData: postEvents,
} = useAxios<Event[]>('/albums');
const { isOpen, open, close } = useModal();

const name = ref('');

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

const handleAction = async () => {
  await postEvents({ title: name.value, userId: 123 });
  close();
};

onMounted(fetchEvents);
</script>
