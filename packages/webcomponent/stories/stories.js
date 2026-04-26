import '../src/Storybook'
import {
  storyButton,
  storyCounter,
  storyAhref,
  storyError,
} from './some.stories.js'

const storybook = document.createElement('storybook-tiny')
storybook.stories = [
  '<small>Components</small>',
  storyButton,
  storyCounter,
  storyAhref,
  storyError
]

document.getElementById('app').appendChild(storybook)
