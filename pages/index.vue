<!-- pages/index.vue -->
<template>
  <div class="centre mx-auto">
    <h1 class="text-3xl font-bold">Welcome to the Homepage</h1>
    <!-- <NuxtLink to="/dashboard">Go to Dashboard</NuxtLink> -->
    <div class="mt-4">
      <NuxtLink to="/login">Login</NuxtLink>
    </div>
    <NuxtLink to="/register" class="btn">Register</NuxtLink>
    <!-- Main content for the homepage -->
  </div>
</template>

<script setup></script>

<style scoped>
  /* Add styles for the homepage */
</style>
