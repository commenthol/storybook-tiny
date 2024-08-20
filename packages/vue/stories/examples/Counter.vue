<!-- you may want to delete this sample -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">
    count is {{ count }}
  </button>
</template>

<style scoped>
button {
  padding: 0.5em 1em;
}
</style>
