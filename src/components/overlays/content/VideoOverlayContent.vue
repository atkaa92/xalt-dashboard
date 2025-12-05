<template>
    <video
        :src="content || ''"
        controls
        loop
        muted
        autoplay
        class="overlay-video"
    >
        Your browser does not support the video tag.
    </video>
</template>

<script setup lang="ts">
const props = defineProps<{ content: string | null }>();
</script>

<style scoped>
.overlay-video {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
