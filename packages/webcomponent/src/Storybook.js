import styles from './Storybook.module.css'
import split from 'split.js'
import { MiElement, define, refsBySelector, esc, refsById } from 'mi-element'

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

const STORE_ITEM = 'tiny-storybook-x'

const getXperc = (px = 130) => (px * 100) / window.innerWidth

const defaultStory = `
<p class="${styles.storybookSectionP}">
  The tiny storybook for
  <a
    href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components"
    target="_blanc"
    rel="norel noreferrer"
  >
    webcomponents
  </a>
</p>
`

class Storybook extends MiElement {
  state = {}

  static shadowRootOptions = null

  static get attributes() {
    return {
      header: 'Storybook Tiny',
      href: '/stories/index.html',
      width: 130,
      stories: []
    }
  }

  static template = `
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
      <nav></nav>
    </aside>
    <section id="split-1" class="stories">
    </section>
  </main>
  `

  render() {
    let xperc = getXperc()
    try {
      xperc = JSON.parse(localStorage.getItem(STORE_ITEM)) || xperc
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
        localStorage.setItem(STORE_ITEM, xperc)
      }
    })
    this.refs = refsBySelector(this.renderRoot, {
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

    if (this.state.title === locHash) {
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
      switch (typeof renderStory) {
        case 'string':
          refs.story.innerHTML = renderStory
          break
        case 'function':
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
  static shadowRootOptions = null

  static get attributes() {
    return {
      active: false,
      story: ''
    }
  }

  update() {
    if (typeof this.story === 'string') {
      this.renderRoot.innerHTML = this.story
      return
    }

    const { title } = this.story

    this.renderRoot.innerHTML = esc`
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
  static shadowRootOptions = null

  static get attributes() {
    return { message: '', stack: '' }
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
    this.refs = refsById(this.renderRoot)
  }

  update() {
    this.refs.message.textContent = this.message
    this.refs.stack.textContent = this.stack
  }
}

define('storybook-tiny-error', StoryError)
