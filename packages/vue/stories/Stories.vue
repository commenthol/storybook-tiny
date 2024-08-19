<script setup>
import Storybook from '../src/Storybook.vue'
import { storyButton, storyCounter } from './some.stories'

const stories = ['<small>Component</small>', storyButton, storyCounter]
</script>

<template>
  <Storybook :stories="stories" />
</template>
