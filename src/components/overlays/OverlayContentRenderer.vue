<template>
  <component
    :is="contentComponent"
    :content="overlay.content"
    :html-content="overlay.htmlContent"
  />
</template>

<script setup lang="ts">
import type { Overlay } from '@/utilities/types';
import { computed, defineAsyncComponent, type Component } from 'vue';

const props = defineProps<{ overlay: Overlay }>();
const ImageOverlayContent = defineAsyncComponent(
  () => import('@/components/overlays/content/ImageOverlayContent.vue'),
);
const VideoOverlayContent = defineAsyncComponent(
  () => import('@/components/overlays/content/VideoOverlayContent.vue'),
);
const HtmlOverlayContent = defineAsyncComponent(
  () => import('@/components/overlays/content/HtmlOverlayContent.vue'),
);

const contentComponent = computed<Component | string>(() => {
  switch (props.overlay.type) {
    case 'image':
      return ImageOverlayContent;
    case 'video':
      return VideoOverlayContent;
    case 'html':
      return HtmlOverlayContent;
    default:
      return 'div';
  }
});
</script>
