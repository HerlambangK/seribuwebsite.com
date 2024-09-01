import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "#app";
import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Ambil token dari cookies
  const accessToken = useCookie("accessToken").value;
  const refreshToken = useCookie("refreshToken").value;
  const role = useCookie("role").value;

  // Perbarui state authStore
  authStore.accessToken = accessToken || "";
  authStore.refreshToken = refreshToken || "";
  authStore.role = role || "";

  // Periksa apakah pengguna sudah login
  if (!authStore.isLoggedIn) {
    return navigateTo("/login"); // Redirect ke halaman login jika tidak terautentikasi
  }

  // Jika perlu memeriksa role, tambahkan logika berikut
  if (to.path.startsWith("/admin") && authStore.role !== "admin") {
    return navigateTo("/"); // Redirect ke halaman lain jika role tidak sesuai
  }
});
