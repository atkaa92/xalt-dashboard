import { useAxios } from '@/composables/useAxios';
import type { Event } from '@/utilities/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEventsStore = defineStore('event', () => {
  // state
  const events = ref<Event[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // getters
  const getEventById = (id: number) => events.value.find((u) => u.id === id) || null;

  // actions
  async function fetchEvents() {
    loading.value = true;
    error.value = null;

    const req = useAxios<Event[]>('/users');
    await req.fetchData();

    if (req.error.value) {
      error.value = req.error.value;
      events.value = [];
    } else {
      events.value = (req.data.value ?? []) as Event[];
    }

    loading.value = false;
  }

  async function postEvents(data: Partial<Event>) {
    loading.value = true;
    error.value = null;

    const req = useAxios<Event[]>('/albums');
    await req.postData<Partial<Event>>(data);

    if (req.error.value) {
      error.value = req.error.value;
    } else {
      await fetchEvents();
    }

    loading.value = false;
  }

  async function deleteEvent(id: number) {
    loading.value = true;
    error.value = null;

    const req = useAxios<Event[]>();
    await req.deleteData(`/users/${id}`);

    if (req.error.value) {
      error.value = req.error.value;
    } else {
      events.value = events.value.filter((event) => event.id !== id);
    }

    loading.value = false;
  }

  function reset() {
    events.value = [];
    loading.value = false;
    error.value = null;
  }
  // exported
  const values = { events, loading, error };
  const getters = { getEventById };
  const actions = { fetchEvents, postEvents, deleteEvent, reset };

  return {
    ...values,
    ...getters,
    ...actions,
  };
});
