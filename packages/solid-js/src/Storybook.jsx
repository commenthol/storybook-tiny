import { For, createSignal, onCleanup, Show, Switch, Match } from 'solid-js'
import styles from './Storybook.module.css'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

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

  const [active, setActive] = createSignal(getLocationHash())
  
  // define hash router
  const handleHashchange = () => setActive(getLocationHash())
  window.addEventListener('hashchange', handleHashchange)
  onCleanup(() => {
    window.removeEventListener('hashchange', handleHashchange)
  })

  return (
    <main class={styles.storybook}>
      <aside style={{ 'flex-basis': cssUnit(width()) }}>
        <h4>
          <a href={href()}>{header()}</a>
        </h4>
        <For each={stories()}>
          {(component) => (
            <Story component={component} active={active} />
          )}
        </For>
      </aside>
      <section>
        <Switch fallback={<DefaultStory />}>
          <Match when={active() === ''}>
            <DefaultStory />
          </Match>
          <For each={stories()}>
            {(component) => (
              <Match when={active() === component?.title}>
                {component.component}
              </Match>
            )}
          </For>
        </Switch>
      </section>
    </main>
  )
}

function DefaultStory() {
  return (
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
          class={props.active() === title ? styles.active : ''}
        >
          {title}
        </a>
      </div>
    </Show>
  )
}

const cssUnit = (unit) => {
  const n = Number(unit)
  return !isNaN(n) ? `${n}px` : unit
}
