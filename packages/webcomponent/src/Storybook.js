import styles from './Storybook.module.css'
import { WcElement, define, cssUnit } from './WcElement'

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

const template = `
<main class="${styles.storybook}">
  <aside>
    <h4 tabindex="0" role="link"></h4>
    <div></div>
  </aside>
  <section class="stories">
  </section>
</main>
`

const defaultStory = `
<p class="${styles.storybookSectionP}">
  The tiny storybook for<span> </span>
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
    this.innerHTML = template
    const { $ } = this
    $.aside = this.querySelector('main > aside')
    $.h4 = $.aside.querySelector('h4')
    this.addEventListener($.h4, 'click', () => {
      location.href = this.href
    })
    $.titles = $.aside.querySelector('div')
    $.story = this.querySelector('section')
    this.addEventListener(window, 'hashchange', () => this._renderStory())
    this.render()
  }

  render() {
    const { $ } = this
    $.h4.textContent = this.header
    $.aside.style.flexBasis = cssUnit(this.width)
    $.titles.innerHTML = ''
    for (const story of this.stories) {
      const $el = document.createElement('storybook-tiny-story')
      $el.story = story
      $.titles.appendChild($el)
    }
    this._renderStory()
  }

  _renderStory() {
    const locHash = getLocationHash()
    if (this.state.title === locHash) { return }

    let renderStory = defaultStory

    for (const story of this.stories) {
      if (typeof story === 'object') {
        const { title, component } = story
        if (title && title === locHash && component) {
          renderStory = component
          this.state.title = title
        }
      }
    }

    const { $ } = this
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
  connectedCallback() {
    if (typeof this.story === 'string') {
      this.innerHTML = this.story
      return
    }

    this.addEventListener(window, 'hashchange', () => this.render())
    const { title } = this.story
    this.innerHTML = `
      <div>
        <a 
          href="#${title}" 
          tabindex="0"
          role="button"
        >${title}</a>
      </div>
    `
    this.render()
  }

  render() {
    const { title } = this.story
    const locHash = getLocationHash()
    this.querySelector('a').className = locHash === title ? styles.active : ''
  }
}

define('storybook-tiny-story', Story)

class StoryError extends WcElement {
  static attributes = { message: '', stack: '' }
  connectedCallback(){
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
