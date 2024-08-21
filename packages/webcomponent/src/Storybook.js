import styles from './Storybook.module.css'
import { WcElement, define, cssUnit } from './WcElement'

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

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

class Storybook extends WcElement {
  $ = {}
  state = {}

  static attributes = {
    header: 'Storybook Tiny',
    href: '/stories/index.html',
    width: 130,
    stories: []
  }

  connectedCallback() {
    this.innerHTML = `
      <main class="${styles.storybook}">
        <aside>
          <h4><a></a></h4>
          <nav></nav>
        </aside>
        <section class="stories">
        </section>
      </main>
    `
    this.$ = {
      aside: this.querySelector('main > aside'),
      h4: this.querySelector('main > aside h4 a'),
      nav: this.querySelector('main > aside nav'),
      story: this.querySelector('main > section')
    }
    this.addEventListener(window, 'hashchange', () => this._renderStory())
    this.render()
  }

  render() {
    const { $ } = this
    $.h4.textContent = this.header
    $.h4.href = this.href
    $.aside.style.flexBasis = cssUnit(this.width)
    $.nav.innerHTML = ''
    for (const story of this.stories) {
      const $el = document.createElement('storybook-tiny-story')
      $el.story = story
      $.nav.appendChild($el)
    }
    this._renderStory()
  }

  _renderStory() {
    const { $ } = this
    const locHash = getLocationHash()

    if (this.state.title === locHash) {
      return
    }

    // update active state on nav
    for (const $el of $.nav.childNodes) {
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
    $.story.innerHTML = ''
    try {
      switch (typeof renderStory) {
        case 'string':
          $.story.innerHTML = renderStory
          break
        case 'function':
          $.story.appendChild(renderStory())
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
      $.story.appendChild(error)
    }
  }
}

define('storybook-tiny', Storybook)

class Story extends WcElement {
  $ = {}

  static attributes = {
    active: false,
    story: ''
  }

  connectedCallback() {
    if (typeof this.story === 'string') {
      this.innerHTML = this.story
      return
    }

    const { title } = this.story

    this.innerHTML = `
      <div>
        <a 
          href="#${title}" 
        >${title}</a>
      </div>
    `
    this.$ = { a: this.querySelector('a') }
  }

  render() {
    this.$.a.className = this.active ? styles.active : ''
  }
}

define('storybook-tiny-story', Story)

class StoryError extends WcElement {
  static attributes = { message: '', stack: '' }

  render() {
    this.innerHTML = `
      <div class="${styles.error}">
        <h2>Error</h2>
        <p>${this.message}</p>
        <p> </p>
        <pre style="white-space: pre-wrap">${this.stack}</pre>
      </div>
    `
  }
}

define('storybook-tiny-error', StoryError)
