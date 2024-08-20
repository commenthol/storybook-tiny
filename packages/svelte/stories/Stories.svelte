<script>
  import Storybook from '../src/Storybook.svelte'
  import ButtonStory from './examples/Button.svelte'
  import TextStory from './examples/Text.svelte'
  import BrokenStory from './examples/Broken.svelte'

  const stories = [
    '<small>Component</small>',
    {
      title: 'Button',
      component: ButtonStory
    },
    {
      title: 'Text',
      component: TextStory
    },
    {
      title: 'Error',
      component: BrokenStory
    }
  ]
</script>

<Storybook {stories} />
