// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
	const authStore = useAuthStore();
	const isAuthenticated = authStore.isLoggedIn;

	if (!isAuthenticated) {
		return navigateTo('/login'); // Redirect ke halaman login
	}
});
