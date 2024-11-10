<script>
function throwError(){
  throw new Error('component thows')
}
</script>

<button onclick={() => throwError()}>throw error</button>