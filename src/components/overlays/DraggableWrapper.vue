<template>
  <div
    class="draggable-overlay"
    :class="{ 'is-dragging': isDragging, 'is-resizing': isResizing }"
    :style="style"
    @mousedown.stop="startDrag"
    @touchstart.stop="startDrag"
  >
    <slot></slot>

    <div class="position-tag top-left">
        L: {{ style.left }} T: {{ style.top }}
    </div>
    <div class="position-tag bottom-right">
        W: {{ style.width }}
    </div>

    <div
        v-for="handle in handles"
        :key="handle"
        :class="['resize-handle', `handle-${handle}`]"
        @mousedown.stop="startResize($event, handle)"
        @touchstart.stop="startResize($event, handle)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useDraggableResizable } from '@/composables/useDraggableResizable';
import type { Overlay, ContainerDimensions, OverlayStyle } from '../../utilities/types';

const props = defineProps<{
    overlay: Overlay;
    containerDimensions: ContainerDimensions;
}>();

const emit = defineEmits<{
    (e: 'update:style', style: OverlayStyle): void;
}>();

const isImage = computed(() => props.overlay.type === 'image');
const handles = ['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'];

const { style, isDragging, isResizing, startDrag, startResize } = useDraggableResizable(
    props.overlay.style,
    props.containerDimensions,
    isImage
);

watch(style, (newStyle) => {
    emit('update:style', newStyle);
}, { deep: true });

watch(() => props.overlay.style, (newParentStyle) => {
    Object.assign(style, newParentStyle);
}, { immediate: true, deep: true });
</script>

<style scoped>
/* These styles are CRITICAL for drag/resize to work */
.draggable-overlay {
  position: absolute; box-sizing: border-box; touch-action: none; border: 2px solid #3498db; z-index: 100;
}
.draggable-overlay.is-dragging { cursor: grabbing; }

/* Position Tags */
.position-tag { position: absolute; background: rgba(52, 152, 219, 0.8); color: white; padding: 2px 5px; font-size: 10px; border-radius: 3px; white-space: nowrap; }
.top-left { top: -15px; left: 0; }
.bottom-right { bottom: -15px; right: 0; }

/* Resize Handles */
.resize-handle { position: absolute; width: 10px; height: 10px; background: white; border: 1px solid #3498db; border-radius: 50%; transform: translate(-50%, -50%); z-index: 101; }
.handle-tl { top: 0; left: 0; cursor: nwse-resize; }
.handle-tr { top: 0; right: -10px; cursor: nesw-resize; }
.handle-bl { bottom: -10px; left: 0; cursor: nesw-resize; }
.handle-br { bottom: -10px; right: -10px; cursor: nwse-resize; }
.handle-t { top: 0; left: 50%; cursor: ns-resize; transform: translateX(-50%) translateY(-50%); }
.handle-b { bottom: 0; left: 50%; cursor: ns-resize; transform: translateX(-50%) translateY(50%); }
.handle-l { left: 0; top: 50%; cursor: ew-resize; transform: translateX(-50%) translateY(-50%); }
.handle-r { right: 0; top: 50%; cursor: ew-resize; transform: translateX(50%) translateY(-50%); }
</style>
