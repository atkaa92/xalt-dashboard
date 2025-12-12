// composables/useToaster.ts
import type { ToasterItem, ToastType } from '@/types';
import { ref } from 'vue';

const toasterItems = ref<ToasterItem[]>([]);

const addToasterItem = (message: string, type: ToastType = 'success') => {
  const id = Date.now();
  toasterItems.value.push({ id, message, type });
  setTimeout(() => {
    removeToasterItem(id);
  }, 5000);
};

const removeToasterItem = (id: number) => {
  toasterItems.value = toasterItems.value.filter((n) => n.id !== id);
};

export const useToaster = () => {
  return {
    toasterItems,
    addToasterItem,
    removeToasterItem,
  };
};
