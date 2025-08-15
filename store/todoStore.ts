import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref<{ id: number; text: string; completed: boolean }[]>([]);

  const addTodo = (text: string) => {
    todos.value.push({ id: Date.now(), text, completed: false });
    saveToLocalStorage();
  };

  const toggleTodo = (id: number) => {
    const todo = todos.value.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveToLocalStorage();
    }
  };

  const removeTodo = (id: number) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem("todos", JSON.stringify(todos.value));
    }
  };

  const loadFromLocalStorage = () => {
    if (process.client) {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        todos.value = JSON.parse(savedTodos);
      }
    }
  };

  onMounted(() => {
    loadFromLocalStorage();
  });

  return { todos, addTodo, toggleTodo, removeTodo };
});
