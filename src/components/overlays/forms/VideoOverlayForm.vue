<template>
  <div>
    <h4 class="text-sm font-semibold text-fg mb-2">Video Settings</h4>
    <div class="mb-2">
      <label class="block text-sm text-gray-500 mb-1">Video File (.mp4, .webm)</label>
      <div
        class="border-2 border-dashed border-global rounded-lg p-8 text-center cursor-pointer hover:bg-main hover:border-blue-500 transition-colors"
        @click="openVideoFileInput"
      >
        <input
          type="file"
          ref="videoFileInput"
          @change="handleVideoFileChange"
          accept="video/*"
          style="display: none"
        />
        <div class="space-y-2">
          <p class="text-fg font-medium">Click to choose video</p>
          <p v-if="isActive" class="text-emerald-500 text-sm font-semibold">
            ✅ Video loaded for preview
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ isActive: boolean }>();

const emit = defineEmits<{
  (e: 'overlayCreated', payload: { type: 'video'; content: string; file: File }): void;
}>();

const videoFileInput = ref<HTMLInputElement | null>(null);

const openVideoFileInput = () => {
  videoFileInput.value?.click();
};

const handleVideoFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
  if (file.size > maxSizeInBytes) {
    alert('File is too large. Please select a video under 10MB.');
    (event.target as HTMLInputElement).value = ''; // Clear input
    return;
  }

  if (file.type.startsWith('video/')) processFile(file);
};

const processFile = (file: File) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    emit('overlayCreated', { type: 'video', content: reader.result as string, file });
  };
  reader.readAsDataURL(file);
};
</script>
