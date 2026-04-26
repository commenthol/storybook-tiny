<script>
  import Storybook from '../src/Storybook.svelte'
  import ButtonStory from './examples/Button.svelte'
  import TextStory from './examples/Text.svelte'
  import BrokenStory from './examples/Broken.svelte'
  import AhrefNoneStory from './examples/AhrefNone.svelte'

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
      title: 'a href="#!"',
      component: AhrefNoneStory
    },
    {
      title: 'Error',
      component: BrokenStory
    }
  ]
</script>

<Storybook {stories} />
