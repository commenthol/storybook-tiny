// -- you may want to delete this sample --

import Counter from './Counter.vue'
import Broken from './Broken.vue'
import AhrefNone from './AhrefNone.vue'

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

export const storyAhrefNone = {
  title: 'a href="#!"',
  component: AhrefNone
}

export const storyBroken = {
  component: Broken
}

