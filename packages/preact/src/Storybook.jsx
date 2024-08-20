 
import styles from './Storybook.module.css'
import { h, isValidElement } from 'preact'
import { useState, useErrorBoundary, useEffect } from 'preact/hooks'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

/**
 * Tiny Storybook for preact
 * @param {object} props
 * @param {Story[] | HTMLElement[] | JSX.Element[]} props.stories stories
 * @param {string} [props.header='Storybook Tiny'] titel
 * @param {string} [props.href='/'] header link
 * @param {number} [props.width=130] aside width
 * @returns {preact.VNode}
 */
export default function Storybook(props) {
  const {
    header = 'Storybook Tiny',
    href = '/stories/index.html',
    width = 130,
    stories = []
  } = props

  const [active, setActive] = useState(getLocationHash())
  const [error, resetError] = useErrorBoundary()

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

  const handleClick = () => {
    resetError()
  }

  if (error) {
    console.error(error)
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
            handleClick={handleClick}
          />
        ))}
      </aside>
      <section className="stories">
        {error ? (
          <StoryError error={error} resetError={resetError} />
        ) : (
          <SbComponent />
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
        href="https://preactjs.com/tutorial/"
        target="_blanc"
        rel="norel noreferrer"
      >
        preact
      </a>
    </p>
  )
}

function Story(props) {
  const { component, handleClick, active } = props

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
      <a href={`#${title}`} className={className} onClick={() => handleClick()}>
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
