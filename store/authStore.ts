import { useCookie } from "#app";
import { defineStore } from "pinia";
import type { User } from "~/utils/types";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
  role: "admin" | "user";
};

type ErrorResponse = {
  error: string;
};

type MessageResponse = {
  message: string;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    accessToken: useCookie("accessToken").value || "",
    refreshToken: useCookie("refreshToken").value || "",
    role: useCookie("role").value || "",
    theme: useCookie("theme").value || "light", // Tambahkan theme ke state
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const { data } = await useFetch<LoginResponse | ErrorResponse | MessageResponse>(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        );

        if (data.value && "accessToken" in data.value) {
          this.user = data.value.user;
          this.accessToken = data.value.accessToken || ""; // Default to empty string if undefined
          this.refreshToken = data.value.refreshToken || ""; // Default to empty string if undefined
          this.role = data.value.role || ""; // Default to empty string if undefined

          // Save tokens in cookies
          useCookie("accessToken").value = this.accessToken;
          useCookie("refreshToken").value = this.refreshToken;
          useCookie("role").value = this.role;

          return data.value;
        } else if (data.value && "error" in data.value) {
          return { error: data.value.error };
        } else if (data.value && "message" in data.value) {
          return { message: data.value.message };
        }
      } catch (error) {
        return { error: "Terjadi kesalahan saat melakukan login." };
      }
    },
    async register(email: string, password: string, username: string) {
      try {
        const { data } = await useFetch<LoginResponse | ErrorResponse | MessageResponse>(
          "/api/auth/register",
          {
            method: "POST",
            body: JSON.stringify({ email, password, username }),
          }
        );

        if (data.value && "accessToken" in data.value) {
          this.user = data.value.user;
          this.accessToken = data.value.accessToken || ""; // Default to empty string if undefined
          this.refreshToken = data.value.refreshToken || ""; // Default to empty string if undefined
          this.role = data.value.role || ""; // Default to empty string if undefined

          // Save tokens in cookies
          useCookie("accessToken").value = this.accessToken;
          useCookie("refreshToken").value = this.refreshToken;
          useCookie("role").value = this.role;

          return data.value;
        } else if (data.value && "error" in data.value) {
          return { error: data.value.error };
        } else if (data.value && "message" in data.value) {
          return { message: data.value.message };
        }
      } catch (error) {
        return { error: "Terjadi kesalahan saat melakukan registrasi." };
      }
    },
    async logout() {
      try {
        await useFetch("/api/auth/logout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout gagal:", error);
      } finally {
        this.user = null;
        this.accessToken = "";
        this.refreshToken = "";
        this.role = "";
        this.theme = "light"; // Reset theme ke default

        // Remove tokens from cookies
        useCookie("accessToken").value = "";
        useCookie("refreshToken").value = "";
        useCookie("role").value = "";
        useCookie("theme").value = ""; // Hapus theme dari cookie
      }
    },

    setTheme(newTheme: string) {
      this.theme = newTheme;
      useCookie("theme").value = newTheme; // Update cookie with new theme
      const colorMode = useColorMode();
      colorMode.preference = newTheme; // Update color mode preference
    },
    // setTheme(theme: string) {
    //   this.theme = theme;
    //   useCookie("theme").value = theme; // Simpan tema ke cookie
    //   document.documentElement.setAttribute("data-theme", theme); // Update tema di HTML root
    // },
  },
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    currentTheme: (state) => state.theme, // Tambahkan getter untuk theme
  },
});
