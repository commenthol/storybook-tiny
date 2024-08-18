import van from 'vanjs-core'
const { button, div } = van.tags

const Button = () => button({ onclick: () => alert('Hi') }, 'Click me')

const Counter = () => {
  const counter = van.state(0)
  return div(
    button({ onclick: () => --counter.val }, '-'),
    counter,
    button({ onclick: () => ++counter.val }, '+')
  )
}

const Throws = () => {
  throw new Error('this component throws')
}

// components under test
export const storyButton = {
  title: Button.name,
  component: () => div({ style: 'margin: 1em' }, Button)
}

export const storyCounter = {
  title: Counter.name,
  component: Counter
}
