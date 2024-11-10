import { mount } from 'svelte'
import Stories from './Stories.svelte'

const app = mount(Stories, {
  target: document.getElementById('app')
})

export default app
