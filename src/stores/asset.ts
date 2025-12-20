import type { Asset, CreateAssetRequest } from '@/types';
import axiosInstance from '@/utilities/axios';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAssetStore = defineStore('asset', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const assets = ref<Asset[]>([]);

  async function fetchAssets() {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get('/api/assets');
      assets.value = response.data.data || [];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message || 'Failed to fetch assets';
      }
    } finally {
      loading.value = false;
    }
  }

  async function createAsset(assetData: CreateAssetRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.post('/api/assets', assetData);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data?.message || err.message;
      } else {
        error.value = (err as Error).message || 'Failed to create asset';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // exported
  const values = { loading, error, assets };
  const actions = { fetchAssets, createAsset };

  return {
    ...values,
    ...actions,
  };
});
