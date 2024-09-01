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
          <template v-for="(item, index) in NavMenuAdmin" :key="index">
            <NuxtLink v-if="!item.children || item.children.length === 0"
              :class="[$route.path.includes(item.link) ? '!text-primary' : '']" :to="item.link"
              class="text-foreground/60 transition-colors hover:text-foreground">
              {{ item.title }}
            </NuxtLink>
            <UiDropdownMenu v-else>
              <UiDropdownMenuTrigger>
                <div class="inline-flex items-center gap-1 text-foreground/60 transition-colors hover:text-foreground">
                  <span>{{ item.title }}</span>
                  <Icon name="heroicons:chevron-down" class="h-3 w-3" />
                </div>
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent class="min-w-[180px]" align="start" :side-offset="5">
                <UiDropdownMenuItem as-child v-for="(child, i) in item.children" :key="i">
                  <template v-if="child.link">
                    <NuxtLink class="cursor-pointer hover:bg-muted" :to="child.link">
                      {{ child.title }}
                    </NuxtLink>
                  </template>
                  <template v-if="child.action">
                    <button class="cursor-pointer hover:bg-muted" @click="handleAction(child.action)">
                      {{ child.title }}
                    </button>
                  </template>
                </UiDropdownMenuItem>
              </UiDropdownMenuContent>
            </UiDropdownMenu>
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
        <UiButton to="https://github.com/BayBreezy/ui-thing" target="_blank" class="h-9 w-9" variant="ghost"
          size="icon">
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
import { NavMenuAdmin } from '@/constants/menuNavAdmin';
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


function handleAction(action: string) {
  if (action === 'logout') {
    logout();
  }
}

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
