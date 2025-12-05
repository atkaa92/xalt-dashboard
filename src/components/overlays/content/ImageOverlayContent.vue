<template>
  <img :src="content || ''" alt="Overlay Image" class="overlay-image" />
</template>

<script setup lang="ts">
defineProps<{ content: string | null }>();
</script>

<style scoped>
.overlay-image {
  width: 100%;
  height: auto;
  display: block;
}
</style>
