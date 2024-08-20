<script setup>
import Storybook from '../src/Storybook.vue'
import { storyButton, storyCounter, storyBroken } from './examples/some.stories'

const stories = [
  '<small>Component</small>',
  storyButton,
  storyCounter,
  storyBroken
]
</script>

<template>
  <Storybook :stories="stories" />
</template>
