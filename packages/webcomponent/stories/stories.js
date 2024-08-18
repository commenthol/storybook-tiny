import '../src/Storybook'
import {
  storyText,
  storyButton,
  storyCounter,
  storyError
} from './some.stories'

const storybook = document.createElement('storybook-tiny')
storybook.stories = [
  '<small>Components</small>',
  storyText,
  storyButton,
  storyCounter,
  storyError
]

document.getElementById('app').appendChild(storybook)
