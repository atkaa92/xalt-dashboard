<template>
  <div class="h-dvh bg-global text-fg overflow-hidden flex flex-col">
    <HeaderBar @toggle-sidebar="toggleSidebar" />
    <div class="flex-1 min-h-0 flex">
      <SideNav :open="sidebarOpen" />
      <main class="flex-1 min-w-0 min-h-0 overflow-auto bg-global">
        <div class="p-3 space-y-6 bg-global">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/navigation/HeaderBar.vue';
import SideNav from '@/components/navigation/SideNav.vue';
import { useNavigation } from '@/composables/useNavigation';
const { sidebarOpen, toggleSidebar } = useNavigation();
</script>
