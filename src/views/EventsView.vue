<template>
  <BaseButton
    @click="openAdd"
    class="flex flex-wrap justify-end items-center gap-2 text-yellowish mb-3"
  >
    Add Event
  </BaseButton>

  <div v-if="loading">Loading ...</div>
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

    <template #cell:actions="{ row }">
      <div class="flex gap-2 items-center justify-end">
        <div @click="openDeleteEvent(row)" class="p-2 bg-button flex rounded-md cursor-pointer">
          <Trash class="text-yellowish w-5 h-5 shrink-0" />
        </div>
        <div class="p-2 bg-button flex rounded-md cursor-pointer">
          <Settings2 class="text-yellowish w-5 h-5 shrink-0" />
        </div>
        <BaseButton
          @click="console.log(row)"
          class="flex flex-wrap justify-end items-center gap-2 text-yellowish"
        >
          Assets
        </BaseButton>
      </div>
    </template>
  </Table>

  <!-- Add Event Modal -->
  <AddEventModal v-model="isAddOpen" @success="store.fetchEvents()" />

  <!-- Delete Event Modal -->
  <DeleteEventModal v-model="isDeleteOpen" :event="eventToDelete" @success="store.fetchEvents()" />
</template>

<script setup lang="ts">
import AddEventModal from '@/components/modals/AddEventModal.vue';
import DeleteEventModal from '@/components/modals/DeleteEventModal.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import Table from '@/components/ui/Table.vue';
import { useModal } from '@/composables/useModal';
import { useEventsStore } from '@/stores/event.ts';
import type { Column, Event } from '@/types';
import { Settings2, Trash } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
const store = useEventsStore();
const { events, loading, error } = storeToRefs(store);
const { isOpen: isAddOpen, open: openAdd } = useModal();
const { isOpen: isDeleteOpen, open: openDelete } = useModal();
const eventToDelete = ref<Event | null>(null);
const columns: Column[] = [
  {
    key: 'id',
    label: 'ID',
    align: 'start',
    noWrap: true,
  },
  { key: 'name', label: 'Name', width: '25%' },
  { key: 'actions', label: '', width: '65%' },
];

const openDeleteEvent = (row: unknown) => {
  if (!row || typeof row !== 'object') return;
  const event = row as Event;
  eventToDelete.value = event;
  openDelete();
};

onMounted(() => store.fetchEvents());
onUnmounted(() => store.reset());
</script>
