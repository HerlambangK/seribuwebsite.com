<!-- pages/register.vue -->
<template>
  <UiCard class="mx-auto max-w-sm" title="Register" description="Create a new account">
    <template #content>
      <UiCardContent as="form" @submit="onSubmit" class="flex flex-col gap-4">
        <Field v-slot="{ componentField }" name="email">
          <UiFormItem label="Email" description="Enter your email address">
            <UiInput type="email" v-bind="componentField" />
          </UiFormItem>
        </Field>
        <Field v-slot="{ componentField }" name="password">
          <UiFormItem label="Password" description="Choose a strong password">
            <UiInput type="password" v-bind="componentField" />
          </UiFormItem>
        </Field>
        <Field v-slot="{ componentField }" name="username">
          <UiFormItem label="Username" description="Choose a username">
            <UiInput v-bind="componentField" />
          </UiFormItem>
        </Field>
        <div>
          <UiButton type="submit" v-if="!loading" :loading="loading"> Register</UiButton>
          <UiButton v-if="loading" class="" disabled
            ><Icon class="h-4 w-4 animate-spin" name="lucide:loader-2" /> Please wait</UiButton
          >
        </div>
        <p v-if="message" class="text-small text-black-500">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </UiCardContent>
    </template>
  </UiCard>
</template>

<script lang="ts" setup>
  import { useAuthStore } from "@/store/authStore";
  //   import { toTypedSchema } from "@vee-validate/zod";
  //   import { useForm } from "vee-validate";
  import { ref } from "vue";
  import { z } from "zod";

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
      username: z.string().min(3, "Username minimal 3 karakter").optional(),
    })
  );

  const { handleSubmit } = useForm({
    validationSchema,
  });

  const loading = ref(false);
  const message = ref("");
  const error = ref("");
  const authStore = useAuthStore();

  const onSubmit = handleSubmit(async (values) => {
    try {
      loading.value = true;
      message.value = "";
      error.value = "";

      // const { data } = await useFetch("/api/auth/register", {
      //   method: "POST",
      //   body: JSON.stringify(values),
      // });
      const data = await authStore.register(values.email, values.password, values.username);

      console.log("data.value", data.value);
      console.log("data", data);
      if (data.message) {
        if (data.message) {
          message.value = data.message;
        }
      }
    } catch (errorResponse) {
      console.log(errorResponse);
      if (errorResponse?.response && errorResponse?.response.data) {
        error.value =
          errorResponse.response.data.message || "Terjadi kesalahan. Silakan coba lagi.";
      } else {
        error.value = "Terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.";
      }
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .error {
    color: red;
  }
</style>
