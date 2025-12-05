<template>
    <div class="html-form-container">
        <h4>HTML/CSS/JS Editor</h4>

        <div class="input-group">
            <div class="label-row">
                <label>Code Editor</label>
                <span class="hint">Supports &lt;style&gt; and &lt;script&gt; tags</span>
            </div>

            <textarea
                v-model="localCode"
                @input="parseAndEmit"
                rows="15"
                class="code-editor"
                placeholder="&lt;h1&gt;Hello&lt;/h1&gt;&#10;&lt;style&gt;h1{color:red}&lt;/style&gt;"
            ></textarea>

            <p class="status-note">⚡ Preview updates automatically as you type</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { HtmlContent } from '../../../utilities/types';

const props = defineProps<{
    initialHtmlContent?: HtmlContent;
}>();

const emit = defineEmits<{
    (e: 'overlayCreated', payload: { type: 'html', content: string, htmlContent: HtmlContent }): void
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
    'console.log("Overlay Mounted");',
    closingScriptTag // Use the variable here
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
watch(() => props.initialHtmlContent, (newVal) => {
    if (newVal && newVal.combinedCode && newVal.combinedCode !== localCode.value) {
        localCode.value = newVal.combinedCode;
    }
});

/**
 * Parsing Logic
 */
const parseAndEmit = () => {
    const code = localCode.value;

    // Regex to match content inside <style> tags
    // Matches: <style ... > content </style>
    // We escape the slash in the regex definition string
    const cssRegex = new RegExp('<style[^>]*>([\\s\\S]*?)<\\/style>', 'i');
    const cssMatch = code.match(cssRegex);
    const css = cssMatch ? cssMatch[1].trim() : '';

    // Regex to match content inside <script> tags
    const jsRegex = new RegExp('<script[^>]*>([\\s\\S]*?)<\\/script>', 'i');
    const jsMatch = code.match(jsRegex);
    const js = jsMatch ? jsMatch[1].trim() : '';

    // Remove style and script blocks to get pure HTML
    const html = code
        .replace(cssRegex, '')
        .replace(jsRegex, '')
        .trim();

    const payload: HtmlContent = {
        html,
        css,
        js,
        combinedCode: code
    };

    emit('overlayCreated', {
        type: 'html',
        content: 'html-ready',
        htmlContent: payload
    });
};
</script>

<style scoped>
.html-form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.input-group {
    display: flex;
    flex-direction: column;
}
.label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
.label-row label {
    font-weight: 600;
    color: #2c3e50;
}
.hint {
    font-size: 0.8rem;
    color: #7f8c8d;
}
.code-editor {
    width: 100%;
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    background-color: #fafafa;
    color: #333;
    resize: vertical;
    box-sizing: border-box;
    line-height: 1.4;
    white-space: pre;
}
.code-editor:focus {
    outline: none;
    border-color: #3498db;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
.status-note {
    font-size: 0.8rem;
    color: #27ae60;
    margin-top: 5px;
    text-align: right;
    font-weight: 500;
}
</style>
