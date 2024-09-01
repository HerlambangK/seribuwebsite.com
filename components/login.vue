<template>
  <UiCard class="mx-auto max-w-sm" title="Login" description="Access your account">
    <template #content>
      <!-- Jika sudah login, tampilkan pesan atau tombol logout -->
      <div v-if="authStore.isLoggedIn">
        <UiCardContent class="center flex flex-col gap-4">
          <p>Anda sudah login sebagai {{ authStore.role }}.<br /></p>
          <UiButton @click="logout">Logout</UiButton>
        </UiCardContent>
      </div>
      <!-- Jika belum login, tampilkan form login -->
      <div v-else>
        <UiCardContent as="form" @submit="onSubmit" class="flex flex-col gap-4">
          <!-- Email Field -->
          <Field v-slot="{ componentField }" name="email">
            <UiFormItem label="Email" description="Enter your email address">
              <UiInput type="email" v-bind="componentField" />
            </UiFormItem>
          </Field>

          <!-- Password Field -->
          <Field v-slot="{ componentField }" name="password">
            <UiFormItem label="Password" description="Enter your password">
              <UiInput type="password" v-bind="componentField" />
            </UiFormItem>
          </Field>

          <!-- Submit Button -->
          <div>
            <UiButton v-if="!loading" type="submit" :loading="loading">Login</UiButton>
            <UiButton v-else disabled>
              <Icon class="h-4 w-4 animate-spin" name="lucide:loader-2" /> Please wait
            </UiButton>
          </div>

          <!-- Error Message -->
          <p class="text-small text-black-500">{{ message }}</p>
          <p v-if="error" class="error">{{ error }}</p>
        </UiCardContent>
      </div>
    </template>
  </UiCard>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/store/authStore";
import { Field, useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const router = useRouter();
const authStore = useAuthStore();
const validationSchema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: "Email wajib diisi",
      })
      .email("Email harus valid"),
    password: z
      .string({
        required_error: "Password wajib diisi",
      })
      .min(6, "Password minimal 6 karakter"),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const loading = ref(false);
const error = ref("");
const message = ref("");

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    error.value = "";
    message.value = "";

    const data = await authStore.login(values.email, values.password);

    if (data && "accessToken" in data) {
      // Handle successful login
      const redirectPath = data.role === "admin" ? "/dashboard/admin" : "/dashboard";
      router.push(redirectPath); // Redirect to the appropriate dashboard
    } else if (data && "error" in data) {
      // Handle error response
      error.value = data.error;
    } else if (data && "message" in data) {
      // Handle message response
      message.value = data.message;
    }
  } catch (errorResponse) {
    console.error(errorResponse);
    error.value = "Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.";
  } finally {
    loading.value = false;
  }
});

// Redirect jika sudah login
onMounted(() => {
  if (authStore.isLoggedIn) {
    const redirectPath = authStore.role === "admin" ? "/dashboard/admin" : "/dashboard";
    router.push(redirectPath); // Arahkan ke dashboard yang sesuai
  }
});

async function logout() {
  await authStore.logout();
  router.push("/login"); // Arahkan kembali ke halaman login setelah logout
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
