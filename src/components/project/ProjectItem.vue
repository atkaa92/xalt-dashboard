<template>
  <div class="p-3 rounded-xl bg-secondary shadow-sm flex items-center gap-6">
    <div class="w-1/4 flex flex-col gap-1">
      <h2 class="font-semibold text-md">{{ project.title }}</h2>
      <p v-for="(line, idx) in project.lines" :key="idx" class="text-sm text-muted">
        {{ line }}
      </p>
    </div>

    <div class="w-3/4 flex flex-wrap justify-end items-center gap-2">
      <RoundedButton
        v-for="(label, idx) in project.buttons"
        :key="idx"
        class="flex flex-wrap justify-end items-center gap-2"
        :class="label === 'Copy Viewer Link' ? 'text-[#b69df8]' : 'text-yellowish'"
      >
        <Copy @click="copy" :size="14" v-if="label === 'Copy Viewer Link'" /> {{ label }}
      </RoundedButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoundedButton from '@/components/ui/RoundedButton.vue';
import { useToaster } from '@/composables/useToaster';
import type { ProjectItem } from '@/utilities/types';
import { Copy } from 'lucide-vue-next';

defineProps<{
  project: ProjectItem;
}>();

const { addToasterItem } = useToaster();

const copy = () => {
  addToasterItem('Link copyed successfully.', 'info');
};
</script>
