import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginSolid from 'eslint-plugin-solid/configs/recommended.js'

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  pluginSolid,
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
]
