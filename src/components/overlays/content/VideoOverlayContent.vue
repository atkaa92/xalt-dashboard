<template>
  <video
    :src="content || ''"
    controls
    autoplay
    loop
    class="w-full h-full object-cover block"
  ></video>
</template>

<script setup lang="ts">
defineProps<{ content: string | null }>();
</script>
