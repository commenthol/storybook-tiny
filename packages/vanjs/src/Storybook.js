import styles from './Storybook.module.css'
import van from 'vanjs-core'
const { a, aside, div, h4, main, p, section } = van.tags

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => HTMLElement} component
 */

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
    stories,
    header = 'Storybook Tiny',
    href = '/stories/index.html',
    width = 130
  } = props

  const locHash = decodeURIComponent(location.hash.substring(1))

  const Component = van.state(() =>
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
  )

  // state change causes full rerendering...
  const active = van.state()

  const handleClick = (component, title) => {
    active.val = title
    Component.val = component
  }

  return main(
    { className: styles.storybook },
    van.derive(() =>
      aside(
        { style: `flex-basis:${cssUnit(width)}` },
        h4(a({ href }, header)),
        stories.map((component, index) =>
          Story({
            component,
            index,
            handleClick,
            active,
            locHash
          })
        )
      )
    ),
    van.derive(() => section({ className: 'stories' }, Component.val))
  )
}

function Story(props) {
  const { component, index, handleClick, active, locHash } = props

  let title
  let _component

  if (component instanceof HTMLElement) {
    return component
  } else if (component.title) {
    title = component.title
    _component = component.component
  } else {
    return null
  }

  if (!active && ((!locHash && index === 0) || title === locHash)) {
    window.requestAnimationFrame(() => {
      handleClick(_component, title)
    })
  }

  return div(
    a(
      {
        href: `#${title}`,
        tabindex: 0,
        role: 'button',
        className: title === active.val ? styles.active : '',
        onclick: () => handleClick(_component, title)
      },
      title
    )
  )
}

const toNumber = (n) => {
  const _n = Number(n)
  return !isNaN(_n) ? _n : undefined
}

const cssUnit = (unit) => {
  const n = toNumber(unit)
  return typeof n === 'number' ? `${n}px` : unit
}
