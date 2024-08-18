const Button = () => {
  const $ = document.createElement('button')
  $.textContent = 'Click me'
  $.addEventListener('click', () => alert('Hi'))
  return $
}

class Counter extends HTMLElement {
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
    this.shadow = this.attachShadow({ mode: 'closed' })
    this.shadow.innerHTML = `
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
        <button>👍</button>
        <button>👎</button>
      </div>
    `
    this.$.count = this.shadow.querySelector('.count')
    this.$.heart = this.shadow.querySelector('.heart')
    this.$.buttons = this.shadow.querySelectorAll('button')
    this.$.buttons[0].addEventListener('click', () => {
      this.init += 1
      this.render()
    })
    this.$.buttons[1].addEventListener('click', () => {
      this.init -= 1
      this.render()
    })
    this.render()
  }

  render() {
    this.$.count.textContent = this.init
    this.$.heart.textContent =
      this.init === 0 ? '🤍' : this.init > 0 ? '❤️' : '💔'
  }
}
window.customElements.define('x-counter', Counter)

export const storyText = {
  title: 'Text',
  component: '<p style="color: red;">Just Text</p>'
}
export const storyButton = {
  title: 'button',
  component: Button
}
export const storyCounter = {
  title: 'x-counter',
  component: () => document.createElement('x-counter')
}
export const storyError = {
  title: 'Error',
  component: () => { throw new Error('baam') }
}

