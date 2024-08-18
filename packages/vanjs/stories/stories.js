import van from 'vanjs-core'
import Storybook from '../src/Storybook'
import { storyButton, storyCounter } from './some.stories'

const { small } = van.tags

// define stories in storybook
van.add(
  document.getElementById('app'),
  Storybook({
    stories: [small('Components'), storyButton, storyCounter]
  })
)
