# @storybook-tiny/svelte

A tiny storybook for [svelte 5][].

# usage

initial setup:

```sh
# add to your project
npm i svelte
npm i -D @storybook-tiny/svelte

# install storybook template auto-detecting your package-manager
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories (e.g. in `./stories/Stories.svelte`):

```html
<script>
  import Storybook from '@storybook-tiny/svelte/src/Storybook.svelte'
  import ButtonStory from './Button.svelte'

  const stories = [
    '<small>Component</small>',
    {
      title: 'Button',
      component: ButtonStory
    }
  ]
</script>

<Storybook {stories} />
```

Then run with vite:

```sh
npx vite --open /stories/
```

# license

MIT licensed

[svelte 5]: https://sveltejs.com/tutorial/
