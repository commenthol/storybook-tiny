import styles from './Storybook.module.css'
import split from 'split.js'
import { MiElement, define, html } from 'mi-element'

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

const STORAGE_KEY_X = 'storybook-tiny:x'

const getXperc = (px = 130) => (px * 100) / window.innerWidth

const defaultStory = html`
  <p class="${styles.storybookSectionP}">
    The tiny storybook for
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components"
      target="_blanc"
      rel="norel noreferrer noopener"
    >
      Web Components
    </a>
  </p>
`

class Storybook extends MiElement {
  state = {}

  static shadowRootInit = null

  static get properties() {
    return {
      header: { initial: 'Storybook Tiny' },
      href: { initial: '/stories/index.html' },
      width: { initial: 130, type: Number },
      stories: { initial: [], attribute: false }
    }
  }

  static template = html`
    <style>
      .${styles.storybook} > .gutter {
        background-color: #eee;
        background-repeat: no-repeat;
        background-position: 50%;
      }
      .${styles.storybook} > .gutter.gutter-horizontal {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
        cursor: col-resize;
      }
    </style>
    <main class="${styles.storybook}">
      <aside id="split-0">
        <h4><a></a></h4>
        <storybook-tiny-theme-toggle></storybook-tiny-theme-toggle>
        <nav></nav>
      </aside>
      <section id="split-1" class="stories"></section>
    </main>
  `

  render() {
    let xperc = getXperc()
    try {
      xperc = JSON.parse(localStorage.getItem(STORAGE_KEY_X)) || xperc
      if (isNaN(xperc)) {
        xperc = getXperc()
      }
    } catch (_err) {
      // noop
    }
    split(['#split-0', '#split-1'], {
      sizes: [xperc, 100 - xperc],
      minSize: 0,
      gutterSize: 4,
      onDragEnd: (sizes) => {
        const [xperc] = sizes
        localStorage.setItem(STORAGE_KEY_X, xperc)
      }
    })
    this.refs = this.refsBySelector({
      aside: 'main > aside',
      h4: 'main > aside h4 a',
      nav: 'main > aside nav',
      story: 'main > section'
    })
    this.on('hashchange', () => this._updateStory(), window)
  }

  update() {
    const { refs } = this
    refs.h4.textContent = this.header
    refs.h4.href = this.href
    refs.nav.innerHTML = ''
    for (const story of this.stories) {
      const $el = document.createElement('storybook-tiny-story')
      $el.story = story
      refs.nav.appendChild($el)
    }
    this._updateStory()
  }

  _updateStory() {
    const { refs } = this
    const locHash = getLocationHash()

    if (this.state.title === locHash || locHash === '!') {
      window.location.hash = this.state.title || ''
      return
    }

    // update active state on nav
    for (const $el of refs.nav.childNodes) {
      $el.active = $el.story?.title === locHash
    }

    let renderStory = defaultStory

    // find active story
    for (const story of this.stories) {
      if (typeof story === 'object') {
        const { title, component } = story
        if (title && title === locHash && component) {
          renderStory = component
          this.state.title = title
        }
      }
    }

    // try rendering the story
    refs.story.innerHTML = ''
    try {
      switch (toString.call(renderStory).slice(8, -1)) {
        case 'String':
          refs.story.innerHTML = renderStory
          break
        case 'Function':
          refs.story.appendChild(renderStory())
          break
        default:
          throw new Error(
            `Can't render "${this.state.title}"; Component must be string or function`
          )
      }
    } catch (err) {
      console.error(err)
      const error = document.createElement('storybook-tiny-error')
      error.message = err.message
      error.stack = err.stack
      refs.story.appendChild(error)
    }
  }
}

define('storybook-tiny', Storybook)

class Story extends MiElement {
  static shadowRootInit = null

  static get properties() {
    return {
      active: { initial: false, type: Boolean },
      story: { initial: '' }
    }
  }

  update() {
    if (typeof this.story === 'string') {
      this.renderRoot.innerHTML = this.story
      return
    }

    const { title } = this.story

    this.renderRoot.innerHTML = html`
      <div>
        <a href="#${title}">${title}</a>
      </div>
    `
    this.refs = { a: this.querySelector('a') }
    this.refs.a.className = this.active ? styles.active : ''
  }
}

define('storybook-tiny-story', Story)

class StoryError extends MiElement {
  static shadowRootInit = null

  static get properties() {
    return {
      message: { initial: '' },
      stack: { initial: '' }
    }
  }

  static template = `
  <div class="${styles.error}">
    <h2>Error</h2>
    <p id="message"></p>
    <p> </p>
    <pre style="white-space: pre-wrap" id="stack"></pre>
  </div>
  `

  render() {
    this.refs = this.refsBySelector({
      message: '#message',
      stack: '#stack'
    })
  }

  update() {
    this.refs.message.textContent = this.message
    this.refs.stack.textContent = this.stack
  }
}

define('storybook-tiny-error', StoryError)

const STORAGE_KEY_THEME = 'storybook-tiny:theme'

const themeToogleOrder = [
  { name: 'system', icon: '🖥️' },
  { name: 'light', icon: '🌞' },
  { name: 'dark', icon: '🌙' }
]

class ThemeToggle extends MiElement {
  _icons = themeToogleOrder.reduce((acc, { name, icon }) => {
    acc[name] = icon
    return acc
  }, {})

  static get properties() {
    return {
      theme: { attribute: false }
    }
  }

  render() {
    this.theme = this._getTheme()
    this.renderRoot.innerHTML = html`
      <style>
        :host {
          display: inline-block;
          margin-left: auto;
          padding: 0.5em;
        }
        button {
          border: none;
          border-radius: 50%;
          width: 2em;
          height: 2em;
          font-size: 1.2em;
          cursor: pointer;
          border: 1px solid #eee;
          background-color: transparent;
        }
        button.dark:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        button.light:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      </style>
      <button aria-label="Toggle theme"></button>
    `
    this._button = this.renderRoot.querySelector('button')
    this._button.addEventListener('click', () => {
      const currentIndex = themeToogleOrder.findIndex(({ name }) => name === this.theme)
      const nextIndex = (currentIndex + 1) % themeToogleOrder.length
      this.theme = themeToogleOrder[nextIndex].name
      this.update()
    })
  }

  update() {
    this._button.textContent = this._icons[this.theme]
    this._button.className = this._getSystemTheme()
    this._updateTheme(this.theme)
  }

  _getTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME)
    if (savedTheme) {
      return savedTheme
    }
    return 'system'
  }

  _getSystemTheme() {
    return this.theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : this.theme
  }

  _updateTheme(theme) {
    localStorage.setItem(STORAGE_KEY_THEME, theme)
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }
}

define('storybook-tiny-theme-toggle', ThemeToggle)
