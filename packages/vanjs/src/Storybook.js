import styles from './Storybook.module.css'
import van from 'vanjs-core'
const { a, aside, div, h4, main, p, section } = van.tags

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => HTMLElement} component
 */

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

/**
 * Simple Storybook for vanjs
 * @param {object} props
 * @param {Story[] | HTMLElement[] | Function[]} props.stories stories
 * @param {string} [props.header='Storybook'] title
 * @param {string} [props.href='/'] header link
 * @param {number} [props.width=130] aside width
 * @returns {HTMLElement}
 */
export default function Storybook(props) {
  const {
    header = 'Storybook Tiny',
    href = '/stories/index.html',
    width = 130,
    stories = []
  } = props

  // define hash router
  const active = van.state(getLocationHash())
  const handleHashchange = () => {
    active.val = getLocationHash()
  }
  // leaks mem but there is no unmount hook yet
  window.addEventListener('hashchange', handleHashchange)

  const SbComponent = van.derive(() => {
    for (const story of stories) {
      if (story?.component) {
        const title = story.title ?? story.component?.constructor?.name
        if (title === active.val) {
          return story.component
        }
      }
    }
    return DefaultStory
  })

  return main(
    { className: styles.storybook },
    van.derive(() =>
      aside(
        { style: `flex-basis:${cssUnit(width)}` },
        h4(a({ href }, header)),
        stories.map((component) =>
          Story({
            component,
            active
          })
        )
      )
    ),
    van.derive(() => section({ className: 'stories' }, SbComponent.val))
  )
}

const DefaultStory = () =>
  p(
    { className: styles.storybookSectionP },
    'The tiny storybook for ',
    a(
      {
        href: 'https://vanjs.org/',
        target: '_blanc',
        rel: 'norel noreferrer'
      },
      'vanjs'
    )
  )

function Story(props) {
  const { component, active } = props

  let title

  if (component instanceof HTMLElement) {
    return component
  } else if (component.title) {
    title = component.title
  } else {
    return null
  }

  return div(
    a(
      {
        href: `#${title}`,
        className: title === active.val ? styles.active : ''
      },
      title
    )
  )
}

const cssUnit = (unit) => {
  const n = Number(unit)
  return !isNaN(n) ? `${n}px` : unit
}
