<template>
  <div>
    <h1>Dashboard User</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts" setup>
  import { useAuthStore } from "@/store/authStore";
  import { useRouter } from "vue-router";

  definePageMeta({
    middleware: "auth",
  });

  const authStore = useAuthStore();
  const router = useRouter();

  function logout() {
    authStore.logout().then(() => {
      router.push("/login"); // Arahkan kembali ke halaman login setelah logout
    });
  }
  onMounted(() => {
    if (authStore.isLoggedIn) {
      router.push("/dashboard"); // Arahkan ke dashboard jika sudah login
    }
  });
</script>
