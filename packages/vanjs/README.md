# @storybook-tiny/vanjs

A tiny storybook for [vanjs][].

# usage

initial setup:

```sh
# add to your project
npm i vanjs-core 
npm i -D @storybook-tiny/vanjs

# install storybook template with npm
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories:

```js
import Storybook from '@storybook-tiny/vanjs'
import van from 'vanjs-core'

const { small } = van.tags

// describe your stories...
const storyButton = {
  title: 'Button',
  component: () => van.tags.button({ onclick: () => alert('Hi') }, 'Click me')
}

// define stories in storybook
van.add(
  document.getElementById('app'),
  Storybook({
    stories: [
      small('Components'),
      storyButton
    ]
  })
)
```

Then run with vite:

```sh
npx vite --open /stories/
```

# license

MIT licensed

[vanjs]: https://vanjs.org/
