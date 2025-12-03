import { ref } from 'vue';

const sidebarOpen = ref(true);
const themeDropdownOpen = ref(false);

export function useNavigation() {
  const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value);
  const toggleThemeDropdown = () => (themeDropdownOpen.value = !themeDropdownOpen.value);

  return {
    toggleSidebar,
    toggleThemeDropdown,
    sidebarOpen,
    themeDropdownOpen,
  };
}
