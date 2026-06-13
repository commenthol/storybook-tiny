 
import styles from './Storybook.module.css'
import { h, isValidElement } from 'preact'
import { useState, useErrorBoundary, useEffect } from 'preact/hooks'
import split from 'split.js'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

const getLocationHash = () => decodeURIComponent(location.hash.substring(1))

const STORAGE_KEY_X = 'storybook-tiny:x'

const getXperc = (px = 130) => (px * 100) / window.innerWidth

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
    stories = []
  } = props

  const [active, setActive] = useState(getLocationHash())
  const [error, resetError] = useErrorBoundary()

  // Initialize split.js drawer resizing
  useEffect(() => {
    let xperc = getXperc()
    try {
      xperc = JSON.parse(localStorage.getItem(STORAGE_KEY_X)) || xperc
      if (isNaN(xperc)) {
        xperc = getXperc()
      }
    } catch (_err) {
      // noop - fall back to default
    }

    split(['#split-0', '#split-1'], {
      sizes: [xperc, 100 - xperc],
      minSize: 0,
      gutterSize: 4,
      onDragEnd: (sizes) => {
        const [xperc] = sizes
        try {
          localStorage.setItem(STORAGE_KEY_X, xperc)
        } catch (_err) {
          // noop - fail silently if localStorage unavailable
        }
      }
    })
  }, [])

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

  const handleClick = () => {
    resetError()
  }

  if (error) {
    console.error(error)
  }

  return (
    <main className={styles.storybook}>
      <aside id="split-0">
        <h4>
          <a href={href}>{header}</a>
        </h4>
        <ThemeToggle />
        {stories.map((component, index) => (
          <Story
            key={index}
            active={active}
            component={component}
            handleClick={handleClick}
          />
        ))}
      </aside>
      <section id="split-1" className="stories">
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
