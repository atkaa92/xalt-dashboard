<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :close-on-esc="true"
    :close-on-backdrop="true"
    title="Add Event"
  >
    <div>
      <BaseInput v-model="name" label="Name" type="text" />
    </div>
    <template #footer>
      <BaseButton
        class="border border-gray-500 bg-transparent text-gray-200 hover:bg-gray-700"
        @click="close"
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
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseModal from '@/components/ui/BaseModal.vue';
import { useToaster } from '@/composables/useToaster';
import { useEventsStore } from '@/stores/event';
import { LoaderCircle } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'success'): void;
}>();

const { addToasterItem } = useToaster();
const store = useEventsStore();
const { loading, error } = storeToRefs(store);
const name = ref('');

const close = () => {
  emit('update:modelValue', false);
};

const handleAddEvent = async () => {
  try {
    const payload = {
      name: name.value,
      additionalAttributes: {},
    };

    await store.createEvent(payload);

    if (error.value) {
      throw new Error(error.value);
    }

    name.value = '';
    addToasterItem('Event has been added successfully.', 'success');
    emit('success');
    close();
  } catch (err) {
    addToasterItem((err as Error).message || 'Failed to add event', 'error');
  }
};
</script>
