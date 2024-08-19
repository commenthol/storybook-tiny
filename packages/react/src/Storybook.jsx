import styles from './Storybook.module.css'
import { useState, useEffect, isValidElement } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

/**
 * Tiny Storybook for react
 * @param {object} props
 * @param {Story[] | HTMLElement[] | JSX.Element[]} props.stories stories
 * @param {string} [props.header='Storybook Tiny'] titel
 * @param {string} [props.href='/'] header link
 * @param {number} [props.width=130] aside width
 * @returns {Node}
 */
export default function Storybook(props) {
  const {
    header = 'Storybook Tiny',
    href = '/stories/index.html',
    width = 130,
    stories = []
  } = props

  const [active, setActive] = useState(getLocationHash())
  const [error, resetError] = useState()

  // define hash router
  useEffect(() => {
    const handleHashchange = () => {
      setActive(getLocationHash())
      resetError()
    }

    window.addEventListener('hashchange', handleHashchange)
    return () => {
      window.removeEventListener('hashchange', handleHashchange)
    }
  }, [])

  // select story component
  let SbComponent = DefaultStory
  for (const story of stories) {
    if (story?.component) {
      const title = story.title ?? story.component?.constructor?.name
      if (title === active) {
        SbComponent = story.component
        break
      }
    }
  }

  return (
    <main className={styles.storybook}>
      <aside style={{ flexBasis: width }}>
        <h4>
          <a href={href}>{header}</a>
        </h4>
        {stories.map((component, index) => (
          <Story
            key={index}
            active={active}
            component={component}
          />
        ))}
      </aside>
      <section className="stories">
        {error ? (
          <StoryError error={error} resetError={() => resetError()} />
        ) : (
          <ErrorBoundary setError={resetError}>
            <SbComponent />
          </ErrorBoundary>
        )}
      </section>
    </main>
  )
}

function DefaultStory() {
  return (
    <p className={styles.storybookSectionP}>
      The tiny storybook for{' '}
      <a
        href="https://reactjs.org/tutorial/tutorial.html"
        target="_blanc"
        rel="norel noreferrer"
      >
        react
      </a>
    </p>
  )
}

function Story(props) {
  const { component, active } = props

  let title

  if (isValidElement(component)) {
    return component
  } else if (component.title) {
    title = component.title
  } else {
    return null
  }

  const className = title === active ? styles.active : ''

  return (
    <div>
      <a href={`#${title}`} className={className}>
        {title}
      </a>
    </div>
  )
}

function StoryError(props) {
  const { error, resetError } = props
  return (
    <div className={styles.error}>
      <h2>Error</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try again</button>
      <p> </p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  )
}
