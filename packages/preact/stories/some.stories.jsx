// components under test
const Button = () => <button onClick={() => alert('Hi')}>Click me</button>

const Throws = () => {
  throw new Error('this component throws')
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
