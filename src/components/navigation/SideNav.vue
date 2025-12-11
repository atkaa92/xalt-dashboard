<template>
  <aside
    class="flex flex-col relative h-full bg-main transition-[width] duration-200 ease-in-out"
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

    <!-- Logout Button -->
    <div class="border-t border-global">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-4 hover:bg-accent/10 hover:text-red-500 text-fg transition-colors text-left"
      >
        <LogOut class="w-5 h-5 shrink-0" />
        <span
          class="truncate transition-opacity duration-200"
          :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        >
          Logout
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import SideNavItem from '@/components/navigation/SideNavItem.vue';
import { useNavigation } from '@/composables/useNavigation';
import { useAuthStore } from '@/stores/auth';
import { navItems } from '@/utilities/data';
import { LogOut } from 'lucide-vue-next';

const { sidebarOpen } = useNavigation();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
}
</script>
