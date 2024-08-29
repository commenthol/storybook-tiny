# @storybook-tiny/preact

A tiny storybook for [preact][].

# usage

initial setup:

```sh
# add to your project
npm i preact
npm i -D @storybook-tiny/preact

# install storybook template auto-detecting your package-manager
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories:

```js 
import Storybook from '@storybook-tiny/preact'
import { render } from 'preact'

// describe your stories...
const storyButton = {
  title: 'Button',
  component: () => <button onClick={() => alert('Hi')}>Click Me</button>
}

// define stories in storybook
render(
  <Storybook
    stories={[
      <small key="1">Components</small>, 
      storyButton
    ]}
  />,
  document.getElementById('app')
)
```

Then run with vite:

```sh
npx vite --open /stories/
```

# license

MIT licensed

[preact]: https://preactjs.com/tutorial/
