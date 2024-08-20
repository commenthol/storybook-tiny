<script>
  export let title = {}

  let name = title?.title
  $: className = title.active ? 'active' : ''
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
