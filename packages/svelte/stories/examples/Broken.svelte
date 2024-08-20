<script>
function throwError(){
  throw new Error('component thows')
}
</script>

<button on:click={() => throwError()}>throw error</button>