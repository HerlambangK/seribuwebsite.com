import { useAuthStore } from "~/store/authStore";

// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // const authStore = useAuthStore();
  const isAdmin = useAuthStore?.role === "admin";

  if (!isAdmin) {
    return navigateTo("/unauthorized"); // Redirect ke halaman unauthorized
  }
});
