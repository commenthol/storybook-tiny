#!/usr/bin/env node

import { install } from '@storybook-tiny/setup'
import { fileURLToPath } from 'url'

const config = {
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  devDependencies: [
    '@storybook-tiny/solid-js',
    'vite-plugin-solid',
    'vite'
  ],
  files: ['stories/*', 'vite.config.js'],
  post: [
    {
      sed: [
        '-i',
        "import Storybook from '../src/Storybook'",
        "import Storybook from '@storybook-tiny/solid-js'",
        'stories/stories.jsx'
      ]
    }
  ]
}

install(config)
