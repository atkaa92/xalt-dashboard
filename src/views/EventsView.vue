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
  <BaseModal v-model="isAddOpen" :close-on-esc="true" :close-on-backdrop="true" title="Add Event">
    <div>
      <BaseInput v-model="name" label="Name" type="text" />
    </div>
    <template #footer>
      <BaseButton
        class="border border-gray-500 bg-transparent text-gray-200 hover:bg-gray-700"
        @click="closeAdd"
      >
        Cancel
      </BaseButton>
      <BaseButton
        class="bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        :disabled="loading"
        @click="handleAddEvent"
      >
        <LoaderCircle v-if="loading" class="animate-spin" />
        Confirm
      </BaseButton>
    </template>
  </BaseModal>

  <!-- Delete Event Modal -->
  <BaseModal
    v-model="isDeleteOpen"
    :close-on-esc="true"
    :close-on-backdrop="true"
    title="Delete Event"
  >
    <div class="text-gray-200">
      Are you sure you want to delete
      <span v-if="eventToDelete" class="font-semibold text-red-400">
        {{ eventToDelete.name }}
      </span>
      ?
    </div>

    <template #footer>
      <button
        class="rounded-lg border border-gray-500 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
        @click="closeDelete"
      >
        Cancel
      </button>
      <button
        class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
        :disabled="loading"
        @click="handleDeleteEvent"
      >
        <LoaderCircle v-if="loading" class="animate-spin" />
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
import { useModal } from '@/composables/useModal';
import { useToaster } from '@/composables/useToaster';
import { useEventsStore } from '@/stores/event.ts';
import type { Column, Event } from '@/types';
import { LoaderCircle, Settings2, Trash } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { addToasterItem } = useToaster();
const store = useEventsStore();
const { events, loading, error } = storeToRefs(store);
const { isOpen: isAddOpen, open: openAdd, close: closeAdd } = useModal();
const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
const name = ref('');
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

const handleAddEvent = async () => {
  try {
    const payload = {
      name: name.value,
      additionalAttributes: {
        theme: 'Tropical',
        maxGuests: '500',
      },
    };

    await store.createEvent(payload);

    if (error.value) {
      throw new Error(error.value);
    }

    name.value = '';
    addToasterItem('Event has been added successfully.', 'success');
    closeAdd();
  } catch (err) {
    addToasterItem((err as Error).message || 'Failed to add event', 'error');
  }
};

const openDeleteEvent = (row: unknown) => {
  if (!row || typeof row !== 'object') return;
  const event = row as Event;
  eventToDelete.value = event;
  openDelete();
};

const handleDeleteEvent = async () => {
  if (!eventToDelete.value) return;
  await store.deleteEvent(eventToDelete.value.id);
  eventToDelete.value = null;
  closeDelete();
  addToasterItem('Event has been deleted successfully.', 'success');
};

// onMounted(() => store.fetchEvents());
// onUnmounted(() => store.reset());
</script>
