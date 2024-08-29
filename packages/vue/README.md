# @storybook-tiny/vue

A tiny storybook for [Vue.js][].

# usage

initial setup:

```sh
# add to your project
npm i vue 
npm i -D @storybook-tiny/vue

# install storybook template auto-detecting your package-manager
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories (e.g. in `some.stories.js`):

```js
import Counter from './Counter.vue'

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
```

define stories in `Stories.vue`

```html
<script setup>
  import Storybook from '@storybook-tiny/vue/src/Storybook.vue'
  import { storyButton, storyCounter } from './some.stories'

  const stories = [
    '<small>Component</small>', 
    storyButton, 
    storyCounter
  ]
</script>

<template>
  <Storybook :stories="stories"></Storybook>
</template>
```

Then run with vite:

```sh
npx vite --open /stories/
```

# license

MIT licensed

[Vue.js]: https://vuejs.org/tutorial
