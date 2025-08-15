<template>
  <div class="flex flex-col w-[960px] p-4 items-center">
    <div class="text-center py-2">
      <p class="text-3xl font-bold">User Dashboard</p>
      <p>Welcome, {{ authStore.username }}</p>
    </div>

    <div class="flex flex-col justify-between gap-2 py-2">
      <input v-model="newTodo" @keyup.enter="addTodo" class="p-2 border rounded" placeholder="Add a new todo" />
      Todo
      <TodoItem v-for="todo in todoStore.todos" :key="todo.id" :todo="todo" @toggle="toggleTodo" @remove="removeTodo" />
    </div>

    <!-- <div class="">
      <UiButton class="py-2" @click="logout">Logout</UiButton>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";
import { useTodoStore } from '@/store/todoStore';
import TodoItem from "./Todo/todoItem.vue";


definePageMeta({
  middleware: "auth",
  layout: "guest",
});

const authStore = useAuthStore();
const router = useRouter();

const todoStore = useTodoStore()
const newTodo = ref('')

function addTodo() {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value)
    newTodo.value = ''
  }
}

function toggleTodo(id: number) {
  todoStore.toggleTodo(id)
}

function removeTodo(id: number) {
  todoStore.removeTodo(id)
}

function logout() {
  authStore.logout().then(() => {
    router.push("/login"); // Arahkan kembali ke halaman login setelah logout
  });
}
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
  }
});
</script>
