<template>
  <header class="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
    <div class="container flex h-14 items-center justify-between">
      <div class="flex items-center gap-10">
        <div class="flex items-center gap-5">
          <UiButton size="icon-sm" variant="outline" class="h-9 w-9 lg:hidden" @click="mobileNav = true">
            <Icon name="heroicons:bars-2" class="h-4 w-4" />
          </UiButton>
          <NuxtLink to="/" class="text-lg font-bold">Seribu Website</NuxtLink>
        </div>
        <nav class="hidden items-center space-x-6 text-sm font-medium lg:flex">
          <!-- Menu untuk belum login -->
          <template v-if="!isAuthenticated">
            <NuxtLink to="/" class="text-foreground/60 transition-colors hover:text-foreground">Home</NuxtLink>
            <NuxtLink to="/about" class="text-foreground/60 transition-colors hover:text-foreground">About</NuxtLink>
            <NuxtLink to="/service" class="text-foreground/60 transition-colors hover:text-foreground">Service
            </NuxtLink>
            <NuxtLink to="/contact" class="text-foreground/60 transition-colors hover:text-foreground">Contact
            </NuxtLink>
          </template>

          <!-- Menu untuk sudah login -->
          <template v-if="isAuthenticated">
            <NuxtLink to="/profile" class="text-foreground/60 transition-colors hover:text-foreground">Profile
            </NuxtLink>
            <NuxtLink to="/order" class="text-foreground/60 transition-colors hover:text-foreground">Order</NuxtLink>
            <NuxtLink to="/settings" class="text-foreground/60 transition-colors hover:text-foreground">Settings
            </NuxtLink>
          </template>
        </nav>
      </div>

      <div class="flex items-center">
        <UiButton size="sm" class="mr-2 hidden min-w-[300px] font-normal text-muted-foreground md:flex"
          variant="outline" @click="isOpen = true">
          <Icon name="lucide:search" />
          Search...
          <UiKbd class="ml-auto">{{ metaSymbol }}+K</UiKbd>
        </UiButton>
        <UiButton size="icon" class="text-muted-foreground md:hidden" variant="ghost" @click="isOpen = true">
          <Icon name="lucide:search" class="h-[18px] w-[18px]" />
        </UiButton>

        <!-- Tampilkan "Sign up" dan "Log in" hanya jika belum login -->
        <template v-if="!isAuthenticated">
          <UiButton to="/register">Sign up</UiButton>
          <UiButton variant="outline" to="/login">Log in</UiButton>
        </template>
        <!-- Tampilkan tombol logout jika sudah login -->
        <template v-if="isAuthenticated">
          <UiButton @click="logout">Logout</UiButton>
        </template>

        <UiButton to="https://github.com/" target="_blank" class="h-9 w-9" variant="ghost" size="icon">
          <Icon name="radix-icons:github-logo" class="h-[18px] w-[18px]" />
        </UiButton>
        <CommandSearch v-model="isOpen" />
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiButton class="h-9 w-9" variant="ghost" size="icon">
              <Icon :name="currentIcon || 'lucide:sun'" class="h-[18px] w-[18px]" />
            </UiButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent align="end" :side-offset="5">
            <UiDropdownMenuItem v-for="(m, i) in modes" :key="i" class="cursor-pointer" :icon="m.icon" :title="m.title"
              @click="setTheme(m.value)" />
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </div>
    </div>
    <MobileNav v-model="mobileNav" />
  </header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAuthStore } from "@/store/authStore";

const isOpen = ref(false);
const mobileNav = ref(false);
const { metaSymbol } = useShortcuts();

const modes = [
  { title: "Light", value: "light", icon: "lucide:sun" },
  { title: "Dark", value: "dark", icon: "lucide:moon" },
  { title: "System", value: "system", icon: "lucide:laptop" },
];

const authStore = useAuthStore();
const router = useRouter();
const currentIcon = computed(() => {
  const theme = authStore.currentTheme;
  return modes.find(mode => mode.value === theme)?.icon || "lucide:sun";
});

function setTheme(value: string) {
  authStore.setTheme(value);
}

const isAuthenticated = computed(() => {
  console.log("isLoggedIn", authStore.isLoggedIn);
  return authStore.isLoggedIn;
});

function logout() {
  authStore.logout().then(() => {
    router.push("/login");
  });
}

defineShortcuts({
  meta_k: () => {
    isOpen.value = !isOpen.value;
  },
});
</script>
