<template>
  <h4>Video Settings</h4>
  <div class="input-group">
    <label>Video File (.mp4, .webm)</label>
    <div class="drop-area video-drop-area" @click="openVideoFileInput">
      <input
        type="file"
        ref="videoFileInput"
        @change="handleVideoFileChange"
        accept="video/*"
        style="display: none"
      />
      <p>Click to **CHOOSE VIDEO**</p>
      <p v-if="isActive">✅ Video loaded for preview.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ isActive: boolean }>();

const emit = defineEmits<{
  (e: 'overlayCreated', payload: { type: 'video'; content: string }): void;
}>();

const videoFileInput = ref<HTMLInputElement | null>(null);

const openVideoFileInput = () => {
  videoFileInput.value?.click();
};

const handleVideoFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.type.startsWith('video/')) processFile(file);
};

const processFile = (file: File) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    emit('overlayCreated', { type: 'video', content: reader.result as string });
  };
  reader.readAsDataURL(file);
};
</script>
