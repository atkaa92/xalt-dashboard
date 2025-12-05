<template>
  <div ref="shadowHost" class="shadow-host-wrapper">
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { HtmlContent } from '../../../utilities/types';

const props = defineProps<{
  htmlContent: HtmlContent;
}>();

const shadowHost = ref<HTMLDivElement | null>(null);

watch(() => props.htmlContent, renderShadowDom, { deep: true });
onMounted(() => { renderShadowDom(); });

function renderShadowDom() {
  if (!shadowHost.value) return;

  let shadowRoot = shadowHost.value.shadowRoot;
  if (!shadowRoot) {
    shadowRoot = shadowHost.value.attachShadow({ mode: 'open' });
  }

  shadowRoot.innerHTML = '';

  // Inject Styles (CSS)
  const style = document.createElement('style');
  style.textContent = props.htmlContent.css;
  shadowRoot.appendChild(style);

  // Inject HTML Content
  const contentWrapper = document.createElement('div');
  contentWrapper.innerHTML = props.htmlContent.html;
  shadowRoot.appendChild(contentWrapper);

  // Inject Script (JS)
  if (props.htmlContent.js) {
    try {
        new Function(props.htmlContent.js)();
    } catch (e) {
        console.error("Error executing overlay JS:", e);
    }
  }
}
</script>

<style scoped>
.shadow-host-wrapper {
  width: 100%;
  height: 100%;
}
</style>
