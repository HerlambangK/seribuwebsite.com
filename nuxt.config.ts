// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2024-04-03',
//   devtools: { enabled: true }
// })

import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],

  vite: {
    optimizeDeps: {
      include: [
        "vue-use-active-scroll",
        "date-fns",
        "@unovis/ts",
        "vee-validate",
        "@vee-validate/zod",
        "zod",
        "v-calendar",
      ],
    },
  },
  // buildModules: ['@nuxt/typescript-build'],
  // modules: ['@nuxtjs/tailwindcss', '@nuxtjs/axios', '@pinia/nuxt'],
  modules: [
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@vee-validate/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@samk-dev/nuxt-vcalendar",
    "@morev/vue-transitions/nuxt",
  ],

  // axios: {
  // 	baseURL: 'http://localhost:3000/api', // sesuaikan dengan URL API Anda
  // },
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    transpile: ["@/utils/auth", "@/utils/jwt", "@/utils/email", "vue-sonner"],
  },

  imports: {
    imports: [{ from: "vue-sonner", name: "toast", as: "useSonner" }],
  },

  content: {
    documentDriven: true,
    navigation: { fields: ["icon", "label"] },
    markdown: {
      toc: { depth: 4, searchDepth: 4 },
    },
    highlight: {
      preload: [
        "json",
        "js",
        "ts",
        "css",
        "html",
        "md",
        "yaml",
        "vue",
        "vue-html",
        "bash",
        "typescript",
        "javascript",
      ],
      theme: {
        default: "material-theme-palenight",
        dark: "one-dark-pro",
      },
    },
  },

  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
  },

  alias: {
    "@utils": resolve(__dirname, "utils"),
  },

  // nitro: {
  // 	middleware: [
  // 		'~/server/middleware/auth.ts', // Include the middleware
  // 	],
  // },
  auth: {
    strategies: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        codeChallengeMethod: "",
        redirectUri: `${process.env.BASE_URL}/api/auth/callback`, // Ini harus sesuai dengan yang Anda setel di Google
      },
    },
  },

  tailwindcss: {
    exposeConfig: true,
  },

  colorMode: {
    classSuffix: "",
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
      {
        from: "vue-sonner",
        name: "toast",
        as: "useSonner",
      },
    ],
  },

  app: {
    head: {
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.9/pdfmake.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.9/vfs_fonts.min.js",
          defer: true,
        },
      ],
    },
  },
});
