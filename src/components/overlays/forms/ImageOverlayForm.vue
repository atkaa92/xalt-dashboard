<template>
  <h4>Image Settings</h4>
  <div class="drop-area" @dragover.prevent @drop="handleDrop" @click="openFileInput">
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      accept="image/*"
      style="display: none"
    />
    <p>Click to **CHOOSE IMAGE** or **DRAG & DROP**</p>
    <p v-if="isActive">✅ Image loaded for preview.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ isActive: boolean }>();

const emit = defineEmits<{
  (e: 'overlayCreated', payload: { type: 'image'; content: string }): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const openFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.type.startsWith('image/')) processFile(file);
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) processFile(file);
};

const processFile = (file: File) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    emit('overlayCreated', { type: 'image', content: reader.result as string });
  };
  reader.readAsDataURL(file);
};
</script>
