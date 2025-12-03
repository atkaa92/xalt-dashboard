import { ref } from 'vue';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export function useFetch<T>(initialPath?: string, options?: RequestInit) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  async function fetchData(path: string = initialPath || '') {
    if (!path) throw new Error('No URL provided');
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${BASE_URL}${path}`, options);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      data.value = await res.json();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  return { data, error, loading, fetchData };
}
