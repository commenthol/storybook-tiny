# @storybook-tiny/react

A tiny storybook for [react][].

# usage

initial setup:

```sh
# add to your project
npm i @storybook-tiny/react

# install with npm
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories:

```js 
import Storybook from '@storybook-tiny/react'
import React from 'react'
import ReactDOM from 'react-dom/client'

// describe your stories...
const storyButton = {
  title: 'Button',
  component: () => <button onClick={() => alert('Hi')}>Click Me</button>
}

// define stories in storybook
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Storybook
      stories={[
        <small key="1">Components</small>,
        storyButton
      ]}
    />
  </React.StrictMode>
)
```

Then run with vite:

```sh
npx vite
```

# license

MIT licensed

[react]: https://reactjs.org/tutorial/tutorial.html
