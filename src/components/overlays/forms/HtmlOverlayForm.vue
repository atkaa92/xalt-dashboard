<template>
  <div class="flex flex-col gap-[10px]">
    <h4>HTML/CSS/JS Editor</h4>

    <div class="flex flex-col">
      <div class="flex justify-between items-center mb-[5px]">
        <label class="font-semibold text-[#2c3e50]">Code Editor</label>
        <span class="text-[0.8rem] text-[#7f8c8d]">
          Supports &lt;style&gt; and &lt;script&gt; tags
        </span>
      </div>

      <textarea
        v-model="localCode"
        @input="parseAndEmit"
        rows="15"
        class="w-full p-[10px] border border-[#bdc3c7] rounded font-mono text-[13px] bg-[#fafafa] text-[#333] resize-y box-border leading-[1.4] whitespace-pre focus:outline-none focus:border-[#3498db] focus:bg-white focus:ring-2 focus:ring-[rgba(52,152,219,0.2)]"
        placeholder="&lt;h1&gt;Hello&lt;/h1&gt;&#10;&lt;style&gt;h1{color:red}&lt;/style&gt;"
      ></textarea>

      <p class="mt-[5px] text-right font-medium text-[0.8rem] text-[#27ae60]">
        ⚡ Preview updates automatically as you type
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HtmlContent } from '@/utilities/types';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  initialHtmlContent?: HtmlContent;
}>();

const emit = defineEmits<{
  (e: 'overlayCreated', payload: { type: 'html'; content: string; htmlContent: HtmlContent }): void;
}>();

const localCode = ref('');

// CRITICAL FIX: Break the closing script tag string so Vue parser doesn't close the block early
const closingScriptTag = '<' + '/script>';

// Default Template
const DEFAULT_CODE = [
  '<div class="card">',
  '  <h2>My Overlay</h2>',
  '  <p>Edit this code to see changes!</p>',
  '</div>',
  '',
  '<style>',
  '.card {',
  '  background: white;',
  '  padding: 20px;',
  '  border-radius: 8px;',
  '  border: 2px solid #3498db;',
  '  text-align: center;',
  '}',
  'h2 { color: #2c3e50; margin: 0; }',
  '</style>',
  '',
  '<script>',
  closingScriptTag, // Use the variable here
].join('\n');

// Initialize
onMounted(() => {
  if (props.initialHtmlContent && props.initialHtmlContent.combinedCode) {
    localCode.value = props.initialHtmlContent.combinedCode;
  } else {
    localCode.value = DEFAULT_CODE;
    parseAndEmit();
  }
});

// Watch for external changes
watch(
  () => props.initialHtmlContent,
  (newVal) => {
    if (newVal && newVal.combinedCode && newVal.combinedCode !== localCode.value) {
      localCode.value = newVal.combinedCode;
    }
  },
);

// Parsing Logic
const parseAndEmit = () => {
  const code = localCode.value;

  // Regex to match content inside <style> tags
  const cssRegex = new RegExp('<style[^>]*>([\\s\\S]*?)<\\/style>', 'i');
  const cssMatch = code.match(cssRegex);
  const css = cssMatch?.[1]?.trim() ?? '';

  // Regex to match content inside <script> tags
  const jsRegex = new RegExp('<script[^>]*>([\\s\\S]*?)<\\/script>', 'i');
  const jsMatch = code.match(jsRegex);
  const js = jsMatch?.[1]?.trim() ?? '';

  // Remove style and script blocks to get pure HTML
  const html = code.replace(cssRegex, '').replace(jsRegex, '').trim();

  const payload: HtmlContent = {
    html,
    css,
    js,
    combinedCode: code,
  };

  emit('overlayCreated', {
    type: 'html',
    content: 'html-ready',
    htmlContent: payload,
  });
};
</script>
