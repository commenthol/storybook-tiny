#!/usr/bin/env node

import { install } from '@storybook-tiny/setup'
import { fileURLToPath } from 'url'

const config = {
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  devDependencies: [
    '@storybook-tiny/react',
    'react-use-error-boundary',
    '@vitejs/plugin-react',
    'vite'
  ],
  files: ['stories/*', 'vite.config.js'],
  post: [
    {
      sed: [
        '-i',
        "import Storybook from '../src/Storybook'",
        "import Storybook from '@storybook-tiny/react'",
        'stories/stories.jsx'
      ]
    }
  ]
}

install(config)
