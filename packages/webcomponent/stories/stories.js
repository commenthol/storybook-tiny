import '../src/Storybook'
import {
  storyButton,
  storyCounter,
  storyError
} from './some.stories'

const storybook = document.createElement('storybook-tiny')
storybook.stories = [
  '<small>Components</small>',
  storyButton,
  storyCounter,
  storyError
]

document.getElementById('app').appendChild(storybook)
