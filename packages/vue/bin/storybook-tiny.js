#!/usr/bin/env node

import { install } from '@storybook-tiny/setup'
import { fileURLToPath } from 'url'

const config = {
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  devDependencies: [
    '@storybook-tiny/vue@workspace:*',
    '@vitejs/plugin-vue',
    'vite'
  ],
  files: ['stories/*', 'vite.config.js'],
  post: [
    {
      sed: [
        '-i',
        "import Storybook from '../src/Storybook.vue'",
        "import Storybook from '@storybook-tiny/vue/src/Storybook.vue'",
        'stories/Stories.vue'
      ]
    }
  ]
}

install(config)
