<script>
  import styles from './Storybook.module.css'
  import { onMount } from 'svelte'
  import Story from './Story.svelte'
  import DefaultStory from './DefaultStory.svelte'

  export let stories = []
  export let header = 'Storybook Tiny'
  export let href = '/stories/index.html'
  export let width = 130

  const cssUnit = (unit) => {
    const n = Number(unit)
    return isNaN(n) ? unit : `${n}px`
  }

  const getLocationHash = () =>
    decodeURIComponent(window.location.hash.slice(1))

  $: locHash = getLocationHash()

  onMount(() => {
    // define hash router
    const handleHashchange = () => {
      locHash = getLocationHash()
    }
    window.addEventListener('hashchange', handleHashchange)
    return () => {
      window.removeEventListener('hashchange', handleHashchange)
    }
  })

  let component = DefaultStory

  $: titles = stories.reduce((acc, story, id) => {
    switch (typeof story) {
      case 'object': {
        if (!story.component) {
          break
        }
        const title = story.title
        if (!title) {
          break
        }
        const active = locHash === title
        if (active) {
          component = story.component
        }
        acc.push({ id, title, active, href: `#${title}` })
        break
      }
      case 'string': {
        acc.push({ id, html: story })
        break
      }
    }
    return acc
  }, [])
</script>

<main class={styles.storybook}>
  <aside style={`flex-basis: ${cssUnit(width)}`}>
    <h4>
      <a {href}>
        {header}
      </a>
    </h4>
    {#each titles as title (title.id)}
      <Story {title} />
    {/each}
  </aside>
  <section class="stories">
    <svelte:component this={component} />
  </section>
</main>

<style>
</style>
