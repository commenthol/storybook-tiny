<script>
  let count = 0

  const handleClick = () => count++
</script>

<button on:click={handleClick}>{count} times clicked</button>
