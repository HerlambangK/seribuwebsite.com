// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2024-04-03',
//   devtools: { enabled: true }
// })

import { resolve } from 'path';

export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	css: ['@/assets/css/tailwind.css'],
	// buildModules: ['@nuxt/typescript-build'],
	// modules: ['@nuxtjs/tailwindcss', '@nuxtjs/axios', '@pinia/nuxt'],
	modules: ['@pinia/nuxt'],
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
		transpile: ['@/utils/auth', '@/utils/jwt', '@/utils/email'],
	},
	runtimeConfig: {
		public: {
			googleClientId: process.env.GOOGLE_CLIENT_ID,
		},
	},

	alias: {
		'@utils': resolve(__dirname, 'utils'),
	},
	auth: {
		strategies: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID,
				codeChallengeMethod: '',
				redirectUri: `${process.env.BASE_URL}/api/auth/callback`, // Ini harus sesuai dengan yang Anda setel di Google
			},
		},
	},
	// nitro: {
	// 	middleware: [
	// 		'~/server/middleware/auth.ts', // Include the middleware
	// 	],
	// },
});
