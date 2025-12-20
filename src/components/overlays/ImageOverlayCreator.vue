<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Sidebar Controls -->
    <div class="lg:col-span-1">
      <div class="p-6 bg-secondary rounded-xl shadow-sm border border-global">
        <h3 class="mb-6 text-lg font-semibold text-fg">✨ Create New Overlay</h3>

        <div class="mb-6">
          <BaseInput
            label="Asset Name"
            placeholder="Enter asset name"
            v-model="assetName"
            :error="nameError"
          />
        </div>

        <div class="mb-6">
          <label for="overlay-selector" class="mb-2 block text-sm font-medium text-fg">
            Select Overlay Type
          </label>
          <select
            id="overlay-selector"
            :value="selectedType"
            @change="selectType(($event.target as HTMLSelectElement).value as OverlayType)"
            class="w-full rounded-lg border border-global bg-main px-3 py-2 text-sm text-fg outline-none transition focus:border-blue-500 cursor-pointer"
          >
            <option :value="null" disabled>-- Choose Type --</option>
            <option value="image">🖼️ Image Overlay</option>
            <option value="video">🎬 Video Overlay</option>
            <option value="html">💻 HTML/CSS/JS Overlay</option>
          </select>
        </div>

        <hr class="my-6 border-global" />

        <div class="space-y-6" v-if="selectedType">
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

        <div class="mt-6" v-if="overlay.type">
          <hr class="mb-6 border-global" />
          <h4 class="mb-4 text-base font-semibold text-fg">Overlay Position & Size</h4>

          <div class="mb-4">
            <BaseInput
              label="Width (%)"
              type="number"
              v-model="overlayWidth"
              min="5"
              max="100"
              step="0.01"
            />
          </div>

          <div class="mb-6" v-if="overlay.type !== 'image'">
            <BaseInput
              label="Height (%)"
              type="number"
              v-model="overlayHeight"
              min="5"
              max="100"
              step="0.01"
            />
          </div>
          <p v-else class="text-sm text-gray-500 mb-6">Image height is locked to 'auto'.</p>

          <BaseButton @click="resetOverlay" class="w-full bg-red-600 hover:bg-red-700 text-white">
            Clear Active Overlay
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Preview Area -->
    <div class="lg:col-span-2 flex flex-col items-center">
      <h2 class="mb-4 text-lg font-semibold tracking-wide text-fg">PREVIEW SCREEN (16:9)</h2>

      <div
        ref="previewContainer"
        class="relative w-full max-w-[800px] aspect-video bg-gray-200 border-4 border-slate-700 overflow-hidden mb-6 rounded-lg shadow-inner"
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

      <div class="flex items-center gap-4">
        <BaseButton
          @click="saveOverlay"
          class="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!overlay.type"
        >
          SAVE OVERLAY
        </BaseButton>
        <BaseButton class="bg-gray-400 hover:bg-gray-500 text-gray-800"> CANCEL </BaseButton>
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
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import { useToaster } from '@/composables/useToaster';
import type { ContainerDimensions, HtmlContent, Overlay, OverlayStyle, OverlayType } from '@/types';
import { handleFileUpload } from '@/utilities/upload';
import { computed, onMounted, reactive, ref } from 'vue';

// --- State ---
const previewContainer = ref<HTMLDivElement | null>(null);
const defaultSize = 30;
const selectedType = ref<OverlayType | null>(null); // Controls which form is visible
const selectedFile = ref<File | null>(null); // Store the raw file for upload
const assetName = ref('');
const nameError = ref<string | undefined>(undefined);
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

// --- Stores ---
import { useAssetStore } from '@/stores/asset';
import { useAuthStore } from '@/stores/auth';

const assetStore = useAssetStore();
const authStore = useAuthStore();
const { addToasterItem } = useToaster();

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
  file?: File;
}) => {
  if (payload.type !== selectedType.value) return;

  overlay.content = payload.content;
  overlay.type = payload.type; // Ensures rendering starts

  // If HTML, update the code state
  if (payload.type === 'html' && payload.htmlContent) {
    Object.assign(overlay.htmlContent, payload.htmlContent);
  }

  // If Image or Video, store the file for upload
  if ((payload.type === 'image' || payload.type === 'video') && payload.file) {
    selectedFile.value = payload.file;
  }
};

const updateOverlayStyle = (newStyles: Partial<OverlayStyle>) => {
  Object.assign(overlay.style, newStyles);
};

const saveOverlay = async () => {
  if (!overlay.type) return;

  nameError.value = undefined;
  if (!assetName.value.trim()) {
    nameError.value = 'Asset name is required';
    return;
  }

  const subdomainId = authStore.user?.subdomainId;
  if (!subdomainId) {
    // eslint-disable-next-line no-console
    console.error('No subdomain ID found for user');
    return;
  }

  try {
    let contentUrl = overlay.content;

    // If we have a file selected (for image/video type), upload it first
    if ((overlay.type === 'image' || overlay.type === 'video') && selectedFile.value) {
      if (!authStore.user?.subdomainId) {
        throw new Error('User subdomain not found');
      }
      addToasterItem('Uploading media to S3...', 'info');
      // Upload returns the final publicly accessible URL
      contentUrl = await handleFileUpload(selectedFile.value);
    }

    const attributes = {
      type: overlay.type,
      content: contentUrl,
      style: { ...overlay.style },
      htmlContent: overlay.type === 'html' ? { ...overlay.htmlContent } : undefined,
      containerDimensions: { ...containerDimensions },
    };

    await assetStore.createAsset({
      subdomainId,
      name: assetName.value,
      attributes,
    });
    addToasterItem('Asset created successfully', 'success');
    resetOverlay();
    assetName.value = '';
    selectedType.value = null;
    selectedFile.value = null; // Clear file after success
  } catch (err: unknown) {
    const message = (err as Error).message || assetStore.error || 'Failed to create asset';
    addToasterItem(message, 'error');
  }
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
