#!/usr/bin/env node

import { install } from '@storybook-tiny/setup'
import { fileURLToPath } from 'url'

const config = {
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  devDependencies: ['@storybook-tiny/webcomponent', 'mi-element', 'vite'],
  files: ['stories/*', 'vite.config.js'],
  post: [
    {
      sed: [
        '-i',
        "import '../src/Storybook'",
        "import '@storybook-tiny/webcomponent'",
        'stories/stories.js'
      ]
    }
  ]
}

install(config)
