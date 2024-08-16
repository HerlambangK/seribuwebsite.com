// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
	const authStore = useAuthStore();
	const isAdmin = authStore.user?.isAdmin;

	if (!isAdmin) {
		return navigateTo('/unauthorized'); // Redirect ke halaman unauthorized
	}
});
