import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'vue/define-macros-order': [
        'error',
        { order: ['defineProps', 'defineEmits', 'defineModel', 'defineSlots'] },
      ],
      'vue/no-mutating-props': 'error',
      'vue/no-setup-props-reactivity-loss': 'warn',
      'vue/no-ref-object-reactivity-loss': 'warn',
      'vue/require-explicit-emits': 'error',
      'vue/no-unused-refs': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-components': 'warn',
      'vue/require-prop-types': 'warn',
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: false },
      ],
      'vue/attribute-hyphenation': ['error', 'always', { ignore: ['dataTestId', 'ariaLabel'] }],
      'vue/no-v-html': 'off',

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'error',
      'no-unreachable': 'error',
      'no-return-await': 'warn',
      'no-implicit-globals': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      eqeqeq: ['error', 'always'],
      // '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
);
