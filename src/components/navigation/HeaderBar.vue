<template>
  <header
    class="h-14 grid grid-cols-3 items-center px-3 sm:px-4 bg-main shadow-md z-10"
    role="banner"
  >
    <div class="flex items-center gap-2 justify-start">
      <img :src="logo" alt="Logo" class="w-24 rounded" />
      <button
        class="p-2 rounded-lg border border-global bg-main hover:opacity-90"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <Menu class="w-5 h-5 text-fg" />
      </button>
    </div>
    <div class="flex justify-center items-center">
      <h1 class="text-md text-fg">{{ gmtTime }}</h1>
    </div>
    <div class="flex items-center justify-end gap-3 relative">
      <div class="flex flex-col items-end leading-tight">
        <span class="font-medium text-fg text-sm">{{ userFullName }}</span>
        <span class="text-xs text-muted">{{ userRole }}</span>
      </div>

      <button
        @click="toggleThemeDropdown"
        class="w-9 h-9 rounded-full overflow-hidden border border-fg focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        <img
          src="https://img.freepik.com/vektor-premium/gambar-profil-avatar-pria-diisolasi-pada-gambar-profil-avatar-latar-belakang-untuk-pria_1293239-4841.jpg"
          alt="User avatar"
          class="w-full h-full object-cover"
        />
      </button>

      <!-- Dropdown -->
      <Transition name="fade">
        <ul
          v-if="themeDropdownOpen"
          class="absolute right-0 top-12 w-40 rounded-lg bg-main shadow-lg overflow-hidden z-50"
        >
          <li
            v-for="opt in options"
            :key="opt.value"
            @click="selectTheme(opt.value)"
            class="px-4 py-2 text-sm hover:bg-accent/10 cursor-pointer"
          >
            {{ opt.label }}
          </li>
        </ul>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.png';
import { useHelpers } from '@/composables/useHelpers';
import { useNavigation } from '@/composables/useNavigation';
import { useTheme } from '@/composables/useTheme';
import { useAuthStore } from '@/stores/auth';
import type { Theme } from '@/types';
import { Menu } from 'lucide-vue-next';
import { computed } from 'vue';

defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

const { setTheme, options } = useTheme();
const { themeDropdownOpen, toggleThemeDropdown } = useNavigation();
const { gmtTime } = useHelpers();
const authStore = useAuthStore();

const userFullName = computed(() => {
  return authStore.user ? `${authStore.user.firstName} ${authStore.user.lastName}` : 'Guest User';
});

const userRole = computed(() => {
  return authStore.user ? authStore.user.role : 'Guest';
});

const selectTheme = (t: Theme) => {
  setTheme(t);
  themeDropdownOpen.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
