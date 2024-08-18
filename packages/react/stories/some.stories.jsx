import { useState } from 'react'

// components under test
const Button = () => <button onClick={() => alert('Hi')}>Click me</button>

const Throws = () => {
  throw new Error('this component throws')
}

const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count - 1)}>-</button>
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

// stories
export const storyButton = {
  title: Button.name,
  component: () => (
    <div style={{ margin: '1em' }}>
      <Button />
    </div>
  )
}

export const storyError = {
  title: 'Error',
  component: Throws
}

export const storyCounter = {
  title: Counter.name,
  component: Counter
}
