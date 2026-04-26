<script setup>
import Storybook from '../src/Storybook.vue'
import { storyButton, storyCounter, storyAhrefNone, storyBroken } from './examples/some.stories'

const stories = [
  '<small>Component</small>',
  storyButton,
  storyCounter,
  storyAhrefNone,
  storyBroken,
]
</script>

<template>
  <Storybook :stories="stories" />
</template>
