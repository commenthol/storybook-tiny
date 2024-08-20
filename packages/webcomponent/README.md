# @storybook-tiny/webcomponent

A tiny storybook for [webcomponents][].

# usage

initial setup:

```sh
# add to your project
npm i -D @storybook-tiny/webcomponent

# install storybook template with npm
npx storybook-tiny
# or with pnpm
npx storybook-tiny -p pnpm
```

define some stories:

```js
import '@storybook-tiny/webcomponent'

// define some custom elements
window.customElements.define('x-text', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' })
    shadow.innerHTML = `<h1>It works!</h1>`
  }
})

// describe your stories...
const storyText = {
  title: 'Text',
  component: '<p>Some Text</p>' // component is mounted with .innerHTML
}

const storyXtext = {
  title: 'x-text',
  component: () => document.createElement('x-text')
}

// define stories in storybook
const storybook = document.createElement('storybook-tiny')
storybook.stories = [
  '<small>Components</small>',
  storyText,
  storyXtext
]
document.getElementById('app').appendChild(storybook)
```

Then run with vite:

```sh
npx vite
```

# license

MIT licensed

[webcomponents]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
