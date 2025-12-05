<template>
  <div
    @mousedown.stop="startDrag"
    @touchstart.stop="startDrag"
    :style="style as StyleValue"
    class="absolute box-border touch-none border-2 border-[#3498db] z-[100]"
    :class="{ 'cursor-grabbing': isDragging }"
  >
    <slot></slot>

    <div
      class="absolute bg-[rgba(52,152,219,0.8)] text-white px-[5px] py-[2px] text-[10px] rounded-[3px] whitespace-nowrap -top-[15px] left-0"
    >
      L: {{ style.left }} T: {{ style.top }}
    </div>
    <div
      class="absolute bg-[rgba(52,152,219,0.8)] text-white px-[5px] py-[2px] text-[10px] rounded-[3px] whitespace-nowrap -bottom-[15px] right-0"
    >
      W: {{ style.width }}
    </div>

    <!-- Resize Handles -->
    <div
      v-for="handle in handles"
      :key="handle"
      :class="[
        'absolute w-[10px] h-[10px] bg-white border border-[#3498db] rounded-full transform z-[101]',
        handle === 'tl' && 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
        handle === 'tr' &&
          'top-0 -right-[10px] -translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
        handle === 'bl' &&
          '-bottom-[10px] left-0 -translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
        handle === 'br' &&
          '-bottom-[10px] -right-[10px] -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
        handle === 't' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize',
        handle === 'b' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
        handle === 'l' && 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
        handle === 'r' && 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
      ]"
      @mousedown.stop="startResize($event, handle)"
      @touchstart.stop="startResize($event, handle)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useDraggableResizable } from '@/composables/useDraggableResizable';
import type { ContainerDimensions, Overlay, OverlayStyle } from '@/utilities/types';
import type { StyleValue } from 'vue';
import { computed, watch } from 'vue';

const props = defineProps<{
  overlay: Overlay;
  containerDimensions: ContainerDimensions;
}>();

const emit = defineEmits<{
  (e: 'update:style', style: OverlayStyle): void;
}>();

const isImage = computed(() => props.overlay.type === 'image');
const handles = ['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'];

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const { style, isDragging, startDrag, startResize } = useDraggableResizable(
  { ...props.overlay.style } as OverlayStyle,
  { ...props.containerDimensions } as ContainerDimensions,
  isImage,
);

watch(
  style,
  (newStyle) => {
    emit('update:style', newStyle);
  },
  { deep: true },
);

watch(
  () => props.overlay.style,
  (newParentStyle) => {
    Object.assign(style, newParentStyle);
  },
  { immediate: true, deep: true },
);
</script>
