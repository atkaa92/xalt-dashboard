<template>
  <aside
    class="flex relative h-full bg-main transition-[width] duration-200 ease-in-out"
    :class="sidebarOpen ? 'w-56' : 'w-12'"
    aria-label="Sidebar"
  >
    <nav class="flex-1 min-h-0 overflow-y-auto">
      <ul>
        <template v-for="item in navItems" :key="item.id">
          <SideNavItem :item="item" />
        </template>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import SideNavItem from '@/components/navigation/SideNavItem.vue';
import { useNavigation } from '@/composables/useNavigation';
import { navItems } from '@/utilities/data';

const { sidebarOpen } = useNavigation();
</script>
