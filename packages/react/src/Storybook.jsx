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
      const hash = getLocationHash()
      if (hash === '!') {
        window.location.hash = active
        return
      }
      setActive(hash)
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
        <ThemeToggle />
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

const STORAGE_KEY_THEME = 'storybook-tiny:theme'

const themeToogleOrder = [
  { name: 'system', icon: '🖥️' },
  { name: 'light', icon: '🌞' },
  { name: 'dark', icon: '🌙' }
]

const icons = themeToogleOrder.reduce((acc, { name, icon }) => {
  acc[name] = icon
  return acc
}, {})

/**
 * Get the current theme setting from localStorage
 * @returns {string} 'system', 'light', or 'dark'
 */
function getTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME)
  if (savedTheme) {
    return savedTheme
  }
  return 'system'
}

/**
 * Get the system theme preference
 * @param {string} theme - the theme setting
 * @returns {string} 'dark' or 'light'
 */
function getSystemTheme(theme) {
  return theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : theme
}

/**
 * Update the theme on the document root and save to localStorage
 * @param {string} theme - 'system', 'light', or 'dark'
 */
function updateTheme(theme) {
  localStorage.setItem(STORAGE_KEY_THEME, theme)
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

/**
 * ThemeToggle component for preact
 */
function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())

  // Initialize theme on mount
  useEffect(() => {
    updateTheme(theme)
  }, [])

  const handleToggle = () => {
    const currentIndex = themeToogleOrder.findIndex(({ name }) => name === theme)
    const nextIndex = (currentIndex + 1) % themeToogleOrder.length
    const nextTheme = themeToogleOrder[nextIndex].name
    setTheme(nextTheme)
    updateTheme(nextTheme)
  }

  const systemTheme = getSystemTheme(theme)
  const buttonIcon = icons[theme]
  const buttonClass = systemTheme === 'dark' ? 'dark' : 'light'

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className={buttonClass}
      style={{
        border: 'none',
        borderRadius: '50%',
        width: '2em',
        height: '2em',
        fontSize: '1.2em',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: systemTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        color: 'inherit'
      }}
    >
      {buttonIcon}
    </button>
  )
}
