<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-fg">
      {{ label }}
    </label>

    <input
      :id="id"
      v-bind="attrs"
      :type="type"
      :value="modelValue"
      @input="onInput"
      class="w-full rounded-lg border border-global bg-main px-3 py-2 text-sm text-fg outline-none transition focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />

    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

const props = defineProps<{
  modelValue: string | number | null;
  label?: string;
  type?: string;
  id?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const attrs = useAttrs();

const type = props.type ?? 'text';
const id = props.id ?? crypto.randomUUID();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>
