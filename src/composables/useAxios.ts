import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { ref } from 'vue';

const BASE_URL = 'http://eurosport.localhost:5001';

export function useAxios<T>(initialPath?: string, options?: AxiosRequestConfig) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  async function fetchData(path: string = initialPath || '') {
    if (!path) throw new Error('No URL provided');
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.request<T>({
        url: `${BASE_URL}${path}`,
        ...options,
      });
      data.value = response.data;
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message;
      }
    } finally {
      loading.value = false;
    }
  }

  async function postData<U>(
    body: U,
    path: string = initialPath || '',
    config?: AxiosRequestConfig,
  ) {
    if (!path) throw new Error('No URL provided');
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post<T>(`${BASE_URL}${path}`, body, { ...options, ...config });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message;
      }
    } finally {
      loading.value = false;
    }
  }

  async function deleteData(path: string = initialPath || '', config?: AxiosRequestConfig) {
    if (!path) throw new Error('No URL provided');
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.delete<T>(`${BASE_URL}${path}`, {
        ...options,
        ...config,
      });

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message;
      }
    } finally {
      loading.value = false;
    }
  }

  return { data, error, loading, fetchData, postData, deleteData };
}
