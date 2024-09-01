<!-- layouts/default.vue -->
<template>
  <div>
    <header>
      <!-- Global Header or Navbar -->
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <!-- Global Footer -->
    </footer>
  </div>
</template>

<script setup><
  import { useActiveScroll} from "vue-use-active-scroll";

const { toc, navigation } = useContent(); 
</script>

<style scoped>
/* Add styles for layout */
</style>
