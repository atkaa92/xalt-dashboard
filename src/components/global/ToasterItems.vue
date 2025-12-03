<template>
  <Teleport to="body">
    <ol
      class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      <li
        v-for="toasterItem in toasterItems"
        :key="toasterItem.id"
        class="mb-4 pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md p-4 pr-6 shadow-lg transition-all border"
        :class="[
          theme[toasterItem.type ?? 'success']?.cBg,
          theme[toasterItem.type ?? 'success']?.cText,
        ]"
      >
        <div class="text-sm font-semibold">
          {{ toasterItem.message }}
        </div>

        <button
          @click="removeToasterItem(toasterItem.id)"
          class="inline-flex h-8 shrink-0 items-center justify-center shadow-lg rounded-md bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50"
          :class="[
            theme[toasterItem.type ?? 'success']?.btnText,
            theme[toasterItem.type ?? 'success']?.btnHover,
            theme[toasterItem.type ?? 'success']?.ring,
          ]"
        >
          OK
        </button>
      </li>
    </ol>
  </Teleport>
</template>

<script setup lang="ts">
import { useToaster } from '@/composables/useToaster';

const { toasterItems, removeToasterItem } = useToaster();

const theme = {
  success: {
    cBg: 'bg-green-50',
    cText: 'text-green-800',
    btnText: 'text-green-700',
    btnHover: 'hover:bg-green-100',
    ring: 'focus:ring-green-300',
  },
  error: {
    cBg: 'bg-red-50',
    cText: 'text-red-800',
    btnText: 'text-red-700',
    btnHover: 'hover:bg-red-100',
    ring: 'focus:ring-red-300',
  },
  info: {
    cBg: 'bg-blue-50',
    cText: 'text-blue-800',
    btnText: 'text-blue-700',
    btnHover: 'hover:bg-blue-100',
    ring: 'focus:ring-blue-300',
  },
  warning: {
    cBg: 'bg-amber-50',
    cText: 'text-amber-900',
    btnText: 'text-amber-800',
    btnHover: 'hover:bg-amber-100',
    ring: 'focus:ring-amber-300',
  },
} as const;
</script>
