// stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from '~/utils/types';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as User | null,
		accessToken: '',
		refreshToken: '',
	}),
	actions: {
		async login(email: string, password: string) {
			const { data } = await useFetch<{
				accessToken: string;
				refreshToken: string;
				user: User;
			}>('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			});

			if (data.value) {
				this.user = data.value.user;
				this.accessToken = data.value.accessToken;
				this.refreshToken = data.value.refreshToken;
			}
		},
		async register(email: string, password: string, username: string) {
			const { data } = await useFetch<{
				accessToken: string;
				refreshToken: string;
				user: User;
			}>('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({ email, password, username }),
			});

			if (data.value) {
				this.user = data.value.user;
				this.accessToken = data.value.accessToken;
				this.refreshToken = data.value.refreshToken;
			}
		},
		async logout() {
			await useFetch('/api/auth/logout', {
				method: 'POST',
			});
			this.user = null;
			this.accessToken = '';
			this.refreshToken = '';
		},
	},
});
