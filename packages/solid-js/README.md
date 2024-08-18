# @storybook-tiny/solid-js

A tiny storybook for [solid-js][].

# usage

initial setup:

```sh
# add to your project
npm i @storybook-tiny/solid-js

# install with npm
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories:

```js 
import Storybook from '@storybook-tiny/solid-js'
import { render } from 'solid-js/web'

// describe your stories...
const storyButton = {
  title: 'Button',
  component: () => <button onClick={() => alert('Hi')}>Click Me</button>
}

// define stories in storybook
render(
  () => (
    <Storybook
      stories={[
        <small>Components</small>,
        storyButton
      ]} 
    />
  ),
  document.getElementById('app')
)
```

Then run with vite:

```sh
npx vite
```

# license

MIT licensed

[solid-js]: https://docs.solidjs.com/
