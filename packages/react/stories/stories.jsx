import React from 'react'
import ReactDOM from 'react-dom/client'
import Storybook from '../src/Storybook'
import { storyButton, storyError, storyCounter } from './some.stories'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Storybook
      stories={[
        <small key="1">Components</small>,
        storyButton,
        storyError,
        storyCounter
      ]}
    />
  </React.StrictMode>
)
