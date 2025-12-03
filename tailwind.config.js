/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fg: 'rgb(var(--color-fg) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        yellowish: 'rgb(var(--color-yellowish) / <alpha-value>)',
        button: 'rgb(var(--color-button) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        global: 'rgb(var(--color-global) / <alpha-value>)',
        main: 'rgb(var(--color-main) / <alpha-value>)',
        textMain: 'rgb(var(--color-text-main) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
