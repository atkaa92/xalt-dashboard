<template>
    <component
        :is="contentComponent"
        :content="overlay.content"
        :html-content="overlay.htmlContent"
    />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
import type { Overlay } from '../../utilities/types';

// Async imports for better bundle splitting
const ImageOverlayContent = defineAsyncComponent(() => import('../overlays/content/ImageOverlayContent.vue'));
const VideoOverlayContent = defineAsyncComponent(() => import('../overlays/content/VideoOverlayContent.vue'));
const HtmlOverlayContent = defineAsyncComponent(() => import('../overlays/content/HtmlOverlayContent.vue'));

const props = defineProps<{ overlay: Overlay }>();

const contentComponent = computed<Component | string>(() => {
    switch (props.overlay.type) {
        case 'image':
            return ImageOverlayContent;
        case 'video':
            return VideoOverlayContent;
        case 'html':
            return HtmlOverlayContent;
        default:
            return 'div'; // Fallback
    }
});
</script>
