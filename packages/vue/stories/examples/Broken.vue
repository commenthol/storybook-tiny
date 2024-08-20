<!-- you may want to delete this sample -->
<script setup>
function throwError () {
  throw new Error('component throws')
}
</script>

<template>
  <button @click="throwError">
    throw error
  </button>
</template>

<style scoped>
</style>
