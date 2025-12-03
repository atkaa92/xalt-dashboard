<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click="onBackdropClick"
      >
        <div
          class="w-full max-w-lg rounded-2xl bg-global text-fg shadow-xl p-6 relative"
          @click.stop
        >
          <button
            type="button"
            class="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 focus:outline-none"
            @click="close"
          >
            ✕
          </button>

          <h2 v-if="title" class="mb-4 text-lg font-semibold">
            {{ title }}
          </h2>

          <slot />

          <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const onBackdropClick = () => {
  if (props.closeOnBackdrop ?? true) close();
};

// Handle ESC press
const onKeydown = (e: KeyboardEvent) => {
  if ((props.closeOnEsc ?? true) && e.key === 'Escape') {
    close();
  }
};

// Add/remove ESC listener when modal opens/closes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKeydown);
    } else {
      window.removeEventListener('keydown', onKeydown);
    }
  },
);

// Safety cleanup on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.15s ease-out,
    opacity 0.15s ease-out;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
