<template>
  <button
    class="btn px-4 py-2 bg-button text-sm rounded-full shadow-md hover:shadow-lg transition-shadow"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>
