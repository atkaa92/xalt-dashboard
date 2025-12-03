import type { Theme, ThemeOption } from '@/utilities/types';
import { onMounted, ref, watch } from 'vue';

const STORAGE_KEY = 'ui-theme';

const options: ThemeOption[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'blue', label: 'Blue' },
];

const resolveSystemTheme = (): Theme => {
  const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return isDark ? 'dark' : 'light';
};

export function useTheme() {
  const current = ref<Theme>('light');

  const apply = (t: Theme) => {
    const html = document.documentElement;
    const effective = t === 'system' ? resolveSystemTheme() : t;
    html.setAttribute('data-theme', effective);
  };

  const setTheme = (t: Theme) => {
    current.value = t;
    localStorage.setItem(STORAGE_KEY, t);
    apply(t);
  };

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? 'system';
    current.value = initial;
    apply(initial);

    // Live update if user changes OS theme while in "system"
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (current.value === 'system') apply('system');
    };
    mq.addEventListener?.('change', listener);
  });

  watch(current, (t) => apply(t));

  return {
    current,
    setTheme,
    options,
  };
}
