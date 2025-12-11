import type { User } from '@/utilities/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);

  // Actions
  async function login(credentials: Record<string, any>) {
    loading.value = true;
    error.value = null;

    // Simulating API call since there is no real backend for auth yet in the provided mocked files
    // In a real scenario, use useAxios to post to /login

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock success
        if (credentials.email) {
          const mockUser = { id: 1, name: 'Test User', email: credentials.email };
          user.value = mockUser as User;
          token.value = 'mock-jwt-token';
          localStorage.setItem('token', 'mock-jwt-token');
          resolve();
        } else {
          error.value = 'Invalid credentials';
          reject(new Error('Invalid credentials'));
        }
        loading.value = false;
      }, 1000);
    });
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    router.push({ name: 'login' });
  }

  function initialize() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      token.value = storedToken;
      // Here we would typically fetch the user profile if the token exists
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    initialize,
  };
});
