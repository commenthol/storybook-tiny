import { render } from 'preact'
import Storybook from '../src/Storybook'
import { storyButton, storyError } from './some.stories'

// define stories in storybook
render(
  <Storybook
    stories={[
      <small key="1">Components</small>,
      storyButton,
      storyError
    ]}
  />,
  document.getElementById('app')
)
