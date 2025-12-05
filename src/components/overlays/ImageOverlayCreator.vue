<template>
  <div class="flex gap-5 p-5 bg-gray-100 min-h-screen">
    <div class="flex-shrink-0 w-[300px]">
      <div class="p-5 bg-white rounded-lg shadow-md">
        <h3 class="mb-4 text-lg font-semibold">✨ Create New Overlay</h3>

        <div class="mb-4">
          <label for="overlay-selector" class="block mb-1 font-semibold">
            Select Overlay Type:
          </label>
          <select
            id="overlay-selector"
            :value="selectedType"
            @change="selectType(($event.target as HTMLSelectElement).value as OverlayType)"
            class="w-full box-border px-2 py-2 border border-gray-300 rounded cursor-pointer bg-white text-gray-800"
          >
            <option :value="null" disabled>-- Choose Type --</option>
            <option value="image">🖼️ Image Overlay</option>
            <option value="video">🎬 Video Overlay</option>
            <option value="html">💻 HTML/CSS/JS Overlay</option>
          </select>
        </div>

        <hr class="my-4 border-gray-200" />

        <div class="space-y-4" v-if="selectedType">
          <ImageOverlayForm
            v-if="selectedType === 'image'"
            :is-active="overlay.type === 'image'"
            @overlay-created="handleOverlayCreation"
          />
          <VideoOverlayForm
            v-else-if="selectedType === 'video'"
            :is-active="overlay.type === 'video'"
            @overlay-created="handleOverlayCreation"
          />
          <HtmlOverlayForm
            v-else-if="selectedType === 'html'"
            :initial-html-content="overlay.htmlContent"
            @overlay-created="handleOverlayCreation"
          />
        </div>

        <div class="mt-4" v-if="overlay.type">
          <hr class="mb-4 border-gray-200" />
          <h4 class="mb-3 text-base font-semibold">Overlay Position &amp; Size</h4>

          <div class="mb-4">
            <label for="overlay-width" class="block mb-1 font-semibold"> Width (%) </label>
            <input
              id="overlay-width"
              type="number"
              v-model="overlayWidth"
              min="5"
              max="100"
              step="0.01"
              class="w-full box-border px-2 py-2 border border-gray-300 rounded"
            />
          </div>

          <div class="mb-4" v-if="overlay.type !== 'image'">
            <label for="overlay-height" class="block mb-1 font-semibold"> Height (%) </label>
            <input
              id="overlay-height"
              type="number"
              v-model="overlayHeight"
              min="5"
              max="100"
              step="0.01"
              class="w-full box-border px-2 py-2 border border-gray-300 rounded"
            />
          </div>
          <p v-else class="text-sm text-gray-500">Image height is locked to 'auto'.</p>

          <button
            @click="resetOverlay"
            class="w-full mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded cursor-pointer hover:bg-red-700 transition-colors"
          >
            Clear Active Overlay
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 flex justify-center">
      <div class="flex flex-col items-center w-full max-w-[900px]">
        <h2 class="mb-4 text-lg font-semibold tracking-wide text-gray-700">
          PREVIEW SCREEN (16:9)
        </h2>

        <div
          ref="previewContainer"
          class="relative w-[800px] h-[450px] bg-gray-200 border-4 border-slate-700 overflow-hidden mb-4"
        >
          <div
            class="w-full h-full flex items-center justify-center bg-gray-400 text-slate-700 text-xl font-semibold"
          >
            <p>16:9 Video/Browser Area</p>
          </div>

          <DraggableWrapper
            v-if="overlay.type"
            :overlay="overlay"
            :container-dimensions="containerDimensions"
            @update:style="updateOverlayStyle"
          >
            <OverlayContentRenderer :overlay="overlay" />
          </DraggableWrapper>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 bg-emerald-500 text-white font-bold rounded shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!overlay.type"
          >
            SAVE OVERLAY
          </button>
          <button
            class="px-4 py-2 bg-gray-400 text-gray-800 font-bold rounded shadow-sm hover:bg-gray-500 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DraggableWrapper from '@/components/overlays/DraggableWrapper.vue';
import HtmlOverlayForm from '@/components/overlays/forms/HtmlOverlayForm.vue';
import ImageOverlayForm from '@/components/overlays/forms/ImageOverlayForm.vue';
import VideoOverlayForm from '@/components/overlays/forms/VideoOverlayForm.vue';
import OverlayContentRenderer from '@/components/overlays/OverlayContentRenderer.vue';
import type {
  ContainerDimensions,
  HtmlContent,
  Overlay,
  OverlayStyle,
  OverlayType,
} from '@/utilities/types';
import { computed, onMounted, reactive, ref } from 'vue';

// --- State ---
const previewContainer = ref<HTMLDivElement | null>(null);
const defaultSize = 30;
const selectedType = ref<OverlayType | null>(null); // Controls which form is visible
const overlay: Overlay = reactive({
  type: null,
  content: null,
  style: { left: '15.00%', top: '15.00%', width: `${defaultSize}.00%`, height: 'auto' },
  htmlContent: {
    html: '<h1>Hello!</h1>',
    css: 'h1 { color: purple; font-family: sans-serif; }',
    js: '',
    combinedCode: '',
  },
});
const containerDimensions: ContainerDimensions = reactive({
  width: 0,
  height: 0,
});

// --- Computed Inputs ---
const overlayWidth = computed<number>({
  get: () => parseFloat(overlay.style.width),
  set: (val) => {
    const clampedVal = Math.min(100, Math.max(5, val));
    updateOverlayStyle({ width: `${clampedVal.toFixed(2)}%` });
  },
});
const overlayHeight = computed<number>({
  get: () => parseFloat(overlay.style.height as string),
  set: (val) => {
    const clampedVal = Math.min(100, Math.max(5, val));
    updateOverlayStyle({ height: `${clampedVal.toFixed(2)}%` });
  },
});

// --- Utilities & Handlers ---
const updateContainerDimensions = () => {
  if (previewContainer.value) {
    const rect = previewContainer.value.getBoundingClientRect();
    containerDimensions.width = rect.width;
    containerDimensions.height = rect.height;
  }
};

const selectType = (type: OverlayType) => {
  // If selecting a different type, reset the current preview
  if (selectedType.value !== type) {
    resetOverlay();
    selectedType.value = type;

    // Initialize default styles based on selection immediately
    overlay.type = type;
    overlay.style.left = '15.00%';
    overlay.style.top = '15.00%';
    overlay.style.width = `${defaultSize}.00%`;
    overlay.style.height = type === 'image' ? 'auto' : `${defaultSize}.00%`;
  }
};

// Handles file uploads (Image/Video) or HTML application
const handleOverlayCreation = (payload: {
  type: OverlayType;
  content: string;
  htmlContent?: HtmlContent;
}) => {
  if (payload.type !== selectedType.value) return;

  overlay.content = payload.content;
  overlay.type = payload.type; // Ensures rendering starts

  // If HTML, update the code state
  if (payload.type === 'html' && payload.htmlContent) {
    Object.assign(overlay.htmlContent, payload.htmlContent);
  }
};

const updateOverlayStyle = (newStyles: Partial<OverlayStyle>) => {
  Object.assign(overlay.style, newStyles);
};

const resetOverlay = () => {
  overlay.type = null;
  overlay.content = null;
  overlay.style.left = '15.00%';
  overlay.style.top = '15.00%';
  overlay.style.width = `${defaultSize}.00%`;
  overlay.style.height = 'auto';
};

onMounted(() => {
  updateContainerDimensions();
  window.addEventListener('resize', updateContainerDimensions);
});
</script>
