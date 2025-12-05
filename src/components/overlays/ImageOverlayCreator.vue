<template>
  <div class="app-layout">
    <div class="sidebar">
      <div class="form-panel">

        <h3>✨ Create New Overlay</h3>

        <div class="input-group">
            <label for="overlay-selector">Select Overlay Type:</label>
            <select
                id="overlay-selector"
                :value="selectedType"
                @change="selectType($event.target.value as OverlayType)"
            >
                <option :value="null" disabled>-- Choose Type --</option>
                <option value="image">🖼️ Image Overlay</option>
                <option value="video">🎬 Video Overlay</option>
                <option value="html">💻 HTML/CSS/JS Overlay</option>
            </select>
        </div>

        <hr>

        <div class="form-settings-container" v-if="selectedType">
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

        <div class="controls" v-if="overlay.type">
            <hr>
            <h4>Overlay Position & Size</h4>

            <div class="input-group">
                <label for="overlay-width">Width (%)</label>
                <input
                    id="overlay-width" type="number" v-model="overlayWidth" min="5" max="100" step="0.01"
                />
            </div>

            <div class="input-group" v-if="overlay.type !== 'image'">
                <label for="overlay-height">Height (%)</label>
                <input
                    id="overlay-height" type="number" v-model="overlayHeight" min="5" max="100" step="0.01"
                />
            </div>
            <p v-else class="note">Image height is locked to 'auto'.</p>

            <button @click="resetOverlay" class="reset-button">
                Clear Active Overlay
            </button>
        </div>
      </div>
    </div>

    <div class="main-preview">
      <div class="preview-wrapper">
        <h2>PREVIEW SCREEN (16:9)</h2>
        <div ref="previewContainer" class="preview-container">

          <div class="background-content">
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
        <div class="action-buttons">
            <button class="save-button" :disabled="!overlay.type">SAVE OVERLAY</button>
            <button class="cancel-button">CANCEL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import DraggableWrapper from './DraggableWrapper.vue';
import OverlayContentRenderer from './OverlayContentRenderer.vue';
import ImageOverlayForm from '../overlays/forms/ImageOverlayForm.vue';
import VideoOverlayForm from '../overlays/forms/VideoOverlayForm.vue';
import HtmlOverlayForm from '../overlays/forms/HtmlOverlayForm.vue';
import type { Overlay, ContainerDimensions, OverlayStyle, OverlayType, HtmlContent } from '../../utilities/types';

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
      js: ''
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
        let clampedVal = Math.min(100, Math.max(5, val));
        updateOverlayStyle({ width: `${clampedVal.toFixed(2)}%` });
    }
});
const overlayHeight = computed<number>({
    get: () => parseFloat(overlay.style.height as string),
    set: (val) => {
        let clampedVal = Math.min(100, Math.max(5, val));
        updateOverlayStyle({ height: `${clampedVal.toFixed(2)}%` });
    }
});

// --- Utilities & Handlers ---

onMounted(() => {
  updateContainerDimensions();
  window.addEventListener('resize', updateContainerDimensions);
});

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
        overlay.style.height = (type === 'image') ? 'auto' : `${defaultSize}.00%`;
    }
};

// Handles file uploads (Image/Video) or HTML application
const handleOverlayCreation = (payload: { type: OverlayType; content: string; htmlContent?: HtmlContent }) => {
    if (payload.type !== selectedType.value) return;

    overlay.content = payload.content;
    overlay.type = payload.type; // Ensures rendering starts

    // If HTML, update the code state
    if (payload.type === 'html' && payload.htmlContent) {
        Object.assign(overlay.htmlContent, payload.htmlContent);
    }
};

const updateOverlayStyle = (newStyles: Partial<OverlayStyle>) => {
    // Function called by DraggableWrapper on drag/resize
    Object.assign(overlay.style, newStyles);
};

const resetOverlay = () => {
    // Only reset content, keep the selectedType for form visibility
    overlay.type = null;
    overlay.content = null;
    overlay.style.left = '15.00%';
    overlay.style.top = '15.00%';
    overlay.style.width = `${defaultSize}.00%`;
    overlay.style.height = 'auto';
};
</script>

<style scoped>
/* GENERAL STYLES (REQUIRED FOR LAYOUT) */
.app-layout { display: flex; gap: 20px; padding: 20px; background-color: #f7f7f7; min-height: 100vh; }
.sidebar { flex-shrink: 0; width: 300px; }
.main-preview { flex-grow: 1; display: flex; justify-content: center; }
.form-panel { padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.drop-area { border: 2px dashed #3498db; padding: 30px 15px; text-align: center; cursor: pointer; background-color: #ecf0f130; border-radius: 6px; margin-bottom: 20px; color: #34495e; }
.preview-container { position: relative; width: 800px; height: 450px; background-color: #e9e9e9; border: 4px solid #34495e; overflow: hidden; margin-bottom: 15px; }
.background-content { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #bdc3c7; color: #34495e; font-size: 1.5em; font-weight: 600; }

/* INPUT STYLES */
.mt-3 { margin-top: 30px; }
.input-group { margin-bottom: 15px; }
.input-group label { display: block; margin-bottom: 5px; font-weight: 600; }
.input-group input, .input-group select, .input-group textarea { width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.input-group select { cursor: pointer; }
.add-button, .reset-button, .save-button, .cancel-button { padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 5px; }
.add-button { background-color: #3498db; color: white; }
.reset-button { background-color: #e74c3c; color: white; display: block; width: 100%; margin-top: 15px; }
.save-button { background-color: #2ecc71; color: white; }
.cancel-button { background-color: #bdc3c7; color: #333; margin-right: 10px; }
</style>
