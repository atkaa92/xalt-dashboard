<template>
  <div>
    <h4 class="text-sm font-semibold text-fg mb-2">Image Settings</h4>
    <div
      class="border-2 border-dashed border-global rounded-lg p-8 text-center cursor-pointer hover:bg-main hover:border-blue-500 transition-colors"
      @dragover.prevent
      @drop="handleDrop"
      @click="openFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        style="display: none"
      />
      <div class="space-y-2">
        <p class="text-fg font-medium">Click to choose image or drag & drop</p>
        <p v-if="isActive" class="text-emerald-500 text-sm font-semibold">
          ✅ Image loaded for preview
        </p>
      </div>
    </div>
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
