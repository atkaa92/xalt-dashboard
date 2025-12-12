import axiosInstance from '@/utilities/axios';
import type { User } from '@/utilities/types';
import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

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
  async function login(credentials: Record<string, string>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.post<LoginResponse>('/api/user/auth', credentials);

      const { token: newToken, user: newUser } = response.data.data;

      token.value = newToken;
      user.value = newUser;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message || 'Login failed';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push({ name: 'login' });
  }

  function initialize() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      token.value = storedToken;
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  async function register(userData: Record<string, string>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.post('/api/users', userData);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message || 'Registration failed';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // exported
  const values = { user, token, loading, error };
  const getters = { isAuthenticated };
  const actions = { login, logout, initialize, register };

  return {
    ...values,
    ...getters,
    ...actions,
  };
});
