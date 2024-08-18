import { For, createSignal, createEffect, Show } from 'solid-js'
import styles from './Storybook.module.css'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

/**
 * Tiny Storybook for solid-js
 * @param {object} props
 * @param {Story[] | HTMLElement[] | JSX.Element[]} props.stories stories
 * @param {string} [props.header='Storybook'] title
 * @param {string} [props.href='/'] header link
 * @param {number} [props.width=130] aside width
 * @returns {Node}
 */
export default function Storybook(props) {
  const stories = () => props.stories
  const header = () => props.header || 'Storybook Tiny'
  const href = () => props.href || '/stories/index.html'
  const width = () => props.width ?? 130

  const [active, setActive] = createSignal('')

  const handleClick = (title) => {
    setActive(title)
  }

  createEffect(() => {
    const locHash = location.hash.substring(1)
    if (active() === '' && locHash) {
      handleClick(locHash)
    }
  })

  return (
    <main class={styles.storybook}>
      <aside style={{ 'flex-basis': cssUnit(width()) }}>
        <h4
          tabindex={0}
          role="link"
          onClick={() => {
            location.href = href()
          }}
        >
          {header()}
        </h4>
        <For each={stories()}>
          {(component, index) => (
            <Story
              component={component}
              index={index}
              active={active}
              handleClick={handleClick}
            />
          )}
        </For>
      </aside>
      <section>
        <Show when={active() === ''}>
          <p class={styles.storybookSectionP}>
            The tiny storybook for{' '}
            <a
              href="https://docs.solidjs.com/"
              target="_blank"
              rel="norel noreferrer"
            >
              solid-js
            </a>
          </p>
        </Show>
        <For each={stories()}>
          {(component) => (
            <Show when={active() === component?.title}>
              {component.component}
            </Show>
          )}
        </For>
      </section>
    </main>
  )
}

function Story(props) {
  // eslint-disable-next-line solid/reactivity
  const title = props.component?.title

  return (
    <Show when={title} fallback={props.component}>
      <div>
        <a
          href={`#${title}`}
          tabIndex={0}
          role="button"
          class={props.active() === title ? styles.active : ''}
          onClick={() => props.handleClick(title)}
        >
          {title}
        </a>
      </div>
    </Show>
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
