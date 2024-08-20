#!/usr/bin/env node

import { install } from '@storybook-tiny/setup'
import { fileURLToPath } from 'url'

const config = {
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  devDependencies: [
    '@storybook-tiny/svelte',
    '@sveltejs/vite-plugin-svelte',
    'vite'
  ],
  files: ['stories/*', 'vite.config.js', 'svelte.config.js'],
  post: [
    {
      sed: [
        '-i',
        "import Storybook from '../src/Storybook.svelte'",
        "import Storybook from '@storybook-tiny/svelte/src/Storybook.svelte'",
        'stories/Stories.svelte'
      ]
    }
  ]
}

install(config)
