<template>
  <section class="grid grid-cols-1 gap-4">
    <div class="flex justify-start">
      <BaseButton @click="router.back()"> Back </BaseButton>
    </div>
    <ImageOverlayCreator />
  </section>
</template>

<script setup lang="ts">
import ImageOverlayCreator from '@/components/overlays/ImageOverlayCreator.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
