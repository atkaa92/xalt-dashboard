import { onMounted, onUnmounted, ref } from 'vue';

const gmtTime = ref('');

export function useHelpers() {
  const updateGMTClock = () => {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    gmtTime.value = `${hours}:${minutes}:${seconds} GMT`;
  };

  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    updateGMTClock();
    timer = setInterval(updateGMTClock, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    gmtTime,
  };
}
