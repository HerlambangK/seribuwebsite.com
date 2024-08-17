<!-- pages/register.vue -->
<template>
	<div>
		<h1>Register</h1>
		<form @submit.prevent="register">
			<input v-model="email" type="email" placeholder="Email" required />
			<input
				v-model="password"
				type="password"
				placeholder="Password"
				required
			/>
			<input v-model="username" type="text" placeholder="Username" required />
			<button type="submit" :disabled="loading">Register</button>
		</form>
		<p v-if="message">{{ message }}</p>
		<p v-if="error" class="error">{{ error }}</p>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import { useAuthStore } from '@/store/authStore';

	const email = ref('');
	const password = ref('');
	const username = ref('');
	const loading = ref(false);
	const message = ref('');
	const error = ref('');
	const authStore = useAuthStore();

	const register = async () => {
		loading.value = true;
		message.value = '';
		error.value = '';

		try {
			const { data } = await useFetch('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({
					email: email.value,
					password: password.value,
					// username: username.value,
				}),
			});

			if (data.value) {
				if (data.value.message) {
					message.value = data.value.message;
				}
			}
		} catch (errorResponse) {
			console.log(errorResponse);
			// Check if the error is an HTTP error
			if (errorResponse.response && errorResponse.response.data) {
				error.value =
					errorResponse.response.data.message ||
					'An error occurred. Please try again.';
			} else {
				error.value = 'An unexpected error occurred. Please try again later.';
			}
		} finally {
			loading.value = false;
		}
	};
</script>

<style scoped>
	.error {
		color: red;
	}
</style>
