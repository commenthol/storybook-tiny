import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintPluginSvelte from 'eslint-plugin-svelte'

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    settings: {},
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'svelte/no-at-html-tags': 'warn'
    }
  }
]
