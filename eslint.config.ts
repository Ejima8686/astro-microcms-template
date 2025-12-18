import eslint from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default [
  globalIgnores(['.astro/', 'dist/']),

  eslint.configs.recommended,

  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    rules: {
      // TypeScriptですでに未使用変数を検出するため無効化
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  ...astro.configs['flat/jsx-a11y-recommended'],
  {
    rules: {
      'astro/jsx-a11y/iframe-has-title': 'off',
    },
  },
];
