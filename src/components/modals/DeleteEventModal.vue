<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :close-on-esc="true"
    :close-on-backdrop="true"
    title="Delete Event"
  >
    <div class="text-gray-200">
      Are you sure you want to delete
      <span v-if="event" class="font-semibold text-red-400">
        {{ event.name }}
      </span>
      ?
    </div>

    <template #footer>
      <BaseButton
        class="border border-gray-500 bg-transparent text-gray-200 hover:bg-gray-700"
        @click="close"
      >
        Cancel
      </BaseButton>
      <BaseButton
        class="bg-red-600 text-white hover:bg-red-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
        :disabled="loading"
        @click="handleDeleteEvent"
      >
        <LoaderCircle v-if="loading" class="animate-spin" />
        Confirm
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import { useToaster } from '@/composables/useToaster';
import { useEventsStore } from '@/stores/event';
import type { Event } from '@/types';
import { LoaderCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  modelValue: boolean;
  event: Event | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const { addToasterItem } = useToaster();
const store = useEventsStore();
const { loading } = storeToRefs(store);

const close = () => {
  emit('update:modelValue', false);
};

const handleDeleteEvent = async () => {
  if (!props.event) return;
  await store.deleteEvent(props.event.id);
  emit('success');
  close();
  addToasterItem('Event has been deleted successfully.', 'success');
};
</script>
