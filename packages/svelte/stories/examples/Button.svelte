<script>
  let count = $state(0)
  const handleClick = () => count++
</script>

<button onclick={handleClick}>{count} times clicked</button>
