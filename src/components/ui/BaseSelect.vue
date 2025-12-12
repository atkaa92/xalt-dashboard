<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-fg">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :id="id"
        v-bind="attrs"
        :value="modelValue"
        @change="onChange"
        class="w-full appearance-none rounded-lg border border-global bg-main px-3 py-2 text-sm text-fg outline-none transition focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-fg">
        <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Option } from '@/types';
import { useAttrs } from 'vue';

const props = defineProps<{
  modelValue: string | number | null;
  label?: string;
  options: Option[];
  id?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const attrs = useAttrs();
const id = props.id ?? crypto.randomUUID();

const onChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLSelectElement).value);
};
</script>
