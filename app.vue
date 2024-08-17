<template>
  <div>
    <ConfigProvider :use-id="useIdFunction">
      <NuxtLoadingIndicator />
      <NuxtPage />
    </ConfigProvider>
    <UiToastToaster />
    <UiVueSonner />
  </div>
</template>

<script lang="ts" setup>
  // Used to provide id's to radix components in nuxt until Vue releases a useId
  import { ConfigProvider } from "radix-vue";

  const useIdFunction = () => useId();

  useSeoMeta({
    // ogImage: "/cover.png",
    twitterTitle: "Seribuwebsite",
    twitterDescription: "Seribu website is a web development studio.",
    // twitterImage: "/cover.png",
    // twitterCard: "summary_large_image",
  });

  useHead({
    htmlAttrs: {
      lang: "id",
    },
    link: [
      // {
      //   rel: "icon",
      //   type: "image/png",
      //   href: "/icon.png",
      // },
    ],
  });
</script>
