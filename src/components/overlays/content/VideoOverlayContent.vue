<template>
  <img :src="content || ''" alt="Overlay Image" class="w-full h-auto block" />
</template>

<script setup lang="ts">
defineProps<{ content: string | null }>();
</script>
