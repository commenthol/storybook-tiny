<svelte:options runes="{true}" />

<script>
  import { run } from 'svelte/legacy';

  import styles from './Storybook.module.css'
  import { onMount } from 'svelte'
  import Story from './Story.svelte'
  import DefaultStory from './DefaultStory.svelte'

  /**
   * @typedef {Object} Props
   * @property {any} [stories]
   * @property {string} [header]
   * @property {string} [href]
   * @property {number} [width]
   */

  /** @type {Props} */
  let {
    stories = [],
    header = 'Storybook Tiny',
    href = '/stories/index.html',
    width = 130
  } = $props();

  const cssUnit = (unit) => {
    const n = Number(unit)
    return isNaN(n) ? unit : `${n}px`
  }

  const getLocationHash = () =>
    decodeURIComponent(window.location.hash.slice(1))

  let locHash = $state(getLocationHash())

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

  let SvelteComponent = $state(DefaultStory)

  let titles = $derived(stories.reduce((acc, story, id) => {
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
          window.requestAnimationFrame(() => {
            SvelteComponent = story.component
          })
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
  }, []))
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
    <SvelteComponent />
  </section>
</main>

<style>
</style>
