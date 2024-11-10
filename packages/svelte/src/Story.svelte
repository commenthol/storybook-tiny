<script>
  let {
    title = {}
  } = $props();

  const name = title?.title
  const className = $derived(title.active ? 'active' : '')
</script>

<div>
  {#if name}
    <a href={title.href} class={className}>{name}</a>
  {:else if title.html}
    <span>{@html title.html}</span>
  {/if}
</div>

<style>
  .active {
    font-weight: bold;
  }
</style>
