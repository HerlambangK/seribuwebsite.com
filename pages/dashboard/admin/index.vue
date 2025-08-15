<template>
  <div>
    <div class="py-2 text-center">
      <p class="text-3xl font-bold">Admin Dashboard</p>
      <p>Welcome, {{ authStore.username }}</p>
    </div>

    <div class="flex justify-between gap-2 py-2">
      <UiCard class="w-1/2 p-3" v-for="n in 3" :key="n">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur suscipit dolore voluptas.
        Fugiat rem iure eaque, quasi minus fugit debitis, accusantium rerum nihil facilis, deleniti
        labore ipsam! Ad, veniam nam!
      </UiCard>
    </div>

    <div class="">
      <UiButton class="py-2" @click="logout">Logout</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/store/authStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout().then(() => {
    router.push("/login");
  });
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
  }
});
</script>
