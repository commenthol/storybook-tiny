import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{js,vue}'] },
  { languageOptions: { globals: { ...globals.browser } } },
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_$',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_err'
        }
      ],
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    ignores: ['dist/']
  }
]
