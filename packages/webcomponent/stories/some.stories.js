import { refsBySelector } from "mi-element/refs"

// define some custom elements
window.customElements.define(
  'x-button',
  class extends HTMLElement {
    connectedCallback() {
      this.renderRoot = this.attachShadow({ mode: 'open' })
      this.$ = document.createElement('button')
      this.$.addEventListener('click', () => alert('Hi'))
      this.renderRoot.appendChild(this.$)
      this.$.textContent = this.childNodes?.[0]?.textContent || 'Click Me'
    }
  }
)

window.customElements.define(
  'x-counter',
  class extends HTMLElement {
    $ = {}
    init = 0

    static observedAttributes = ['init']

    attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case 'init':
          this[name] = isNaN(Number(newValue)) ? 0 : Number(newValue)
          break
      }
    }

    connectedCallback() {
      this.renderRoot = this.attachShadow({ mode: 'closed' })
      this.renderRoot.innerHTML = `
      <style>
        :host {
          font-size: 1.5em;
        }
        span {
          padding-right: 0.25em;
        }
        span.count { 
          display: inline-block; 
          width: 4em;
          text-align: right; 
        }
        button { 
          font-size: 1em;
        }
      </style>
      <div>
        <span class="count"></span>
        <span class="heart"></span>
        <button id="up">👍</button>
        <button id="down">👎</button>
      </div>
      `
      this.refs = refsBySelector({
        count: '.count',
        heart: '.heart',
        up: '#up',
        down: '#down'
      })
      this.refs.up.addEventListener('click', () => {
        this.init += 1
        this.render()
      })
      this.refs.down.addEventListener('click', () => {
        this.init -= 1
        this.render()
      })
      this.render()
    }

    render() {
      this.refs.count.textContent = this.init
      this.refs.heart.textContent =
        this.init === 0 ? '🤍' : this.init > 0 ? '❤️' : '💔'
    }
  }
)

// define your stories
export const storyButton = {
  title: 'x-button',
  component: '<x-button>My Text</x-button>'
}
export const storyCounter = {
  title: 'x-counter',
  component: () => document.createElement('x-counter')
}
export const storyError = {
  title: 'Hello 🌍 Error',
  component: () => {
    throw new Error('Hello 🌍 Error')
  }
}
