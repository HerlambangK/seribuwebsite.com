<template>
  <NavBarComponent />
  <div class="min-h-screen flex">
    <aside class="col-span-2">
      <SideBar />
    </aside>
    <main class="col-span-10">
      <!-- <NuxtPage /> -->
      <slot />
    </main>
  </div>
</template>

<script setup>
import SideBar from "../components/Shared/SideBar.vue";
definePageMeta({
  middleware: "auth",
});
</script>

<style scoped></style>
