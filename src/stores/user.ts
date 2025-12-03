import { useAxios } from '@/composables/useAxios';
import type { User } from '@/utilities/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // state
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // getters
  const getUserById = (id: number) => users.value.find((u) => u.id === id);

  // actions
  async function fetchUsers() {
    loading.value = true;
    error.value = null;

    const req = useAxios<User[]>('/users');
    await req.fetchData();

    if (req.error.value) {
      error.value = req.error.value;
      users.value = [];
    } else {
      users.value = (req.data.value ?? []) as User[];
    }

    loading.value = false;
  }

  function reset() {
    users.value = [];
    loading.value = false;
    error.value = null;
  }

  // exported
  const values = { users, loading, error };
  const getters = { getUserById };
  const actions = { fetchUsers, reset };

  return {
    ...values,
    ...getters,
    ...actions,
  };
});
