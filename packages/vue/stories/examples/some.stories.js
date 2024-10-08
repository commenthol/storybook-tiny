// -- you may want to delete this sample --

import Counter from './Counter.vue'
import Broken from './Broken.vue'

const Button = {
  setup() {
    const handleClick = () => alert('Hi')
    return { handleClick }
  },
  template: '<button @click="handleClick">Click me</button>'
}

export const storyButton = {
  title: 'Button',
  component: Button
}

export const storyCounter = {
  component: Counter
}

export const storyBroken = {
  component: Broken
}
