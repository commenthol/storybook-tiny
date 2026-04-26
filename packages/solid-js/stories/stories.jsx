import { render } from 'solid-js/web'
import Storybook from '../src/Storybook'
import { storyButton, storyWorks, storyAhrefNone } from './some.stories'

// define stories in storybook
render(
  () => (
    <Storybook
      stories={[
        <small>Components</small>,
        storyButton,
        storyWorks,
        storyAhrefNone
      ]} 
    />
  ),
  document.getElementById('app')
)
