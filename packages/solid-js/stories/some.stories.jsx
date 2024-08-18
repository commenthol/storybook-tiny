// components under test
function Button() {
  return <button onClick={() => alert('Hi')}>Click me</button>
}

function Works() {
  return <h1>It works!</h1>
}

// stories
export const storyButton = {
  title: 'Button',
  component: () => (
    <div style={{ margin: '1em' }}>
      <Button />
    </div>
  )
}

export const storyWorks = {
  title: 'Test',
  component: Works
}
