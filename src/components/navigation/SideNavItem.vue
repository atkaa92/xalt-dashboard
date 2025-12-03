<template>
  <li class="my-0">
    <RouterLink
      :to="item.to"
      class="flex items-center gap-3 px-3 py-4 hover:bg-accent/10"
      exact-active-class="bg-accent/10 text-yellowish"
    >
      <component
        :is="item.icon"
        class="w-5 h-5 shrink-0"
        :class="route.path === item.to ? 'text-yellowish' : 'text-fg'"
      />
      <span
        class="truncate transition-opacity duration-200"
        :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      >
        {{ item.label }}
      </span>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation';
import type { NavItem } from '@/utilities/types';
import { useRoute } from 'vue-router';

defineProps<{
  item: NavItem;
}>();

const route = useRoute();

const { sidebarOpen } = useNavigation();
</script>
