#!/usr/bin/env node

import { install } from '@storybook-tiny/setup'
import { fileURLToPath } from 'url'

const config = {
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  devDependencies: ['@storybook-tiny/vanjs@workspace:*', 'vite'],
  files: ['stories/*', 'vite.config.js'],
  post: [
    {
      sed: [
        '-i',
        "import Storybook from '../src/Storybook'",
        "import Storybook from '@storybook-tiny/vanjs'",
        'stories/stories.js'
      ]
    }
  ]
}

install(config)
