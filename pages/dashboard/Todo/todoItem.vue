<template>
    <div class="flex items-center justify-between p-2 border-b">
        <input type="checkbox" v-model="todo.completed" @input="toggle" />
        <span :class="{ 'line-through': todo.completed }" @click="toggle">{{ todo.text }}</span>

        <button @click="toggle" class="text-red-500">Done</button>
        <button @click="remove" class="text-red-500">Delete</button>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ todo: { id: number; text: string; completed: boolean } }>()
const emit = defineEmits(['toggle', 'remove'])

function toggle() {
    emit('toggle', props.todo.id)
}

function remove() {
    emit('remove', props.todo.id)
}
</script>

<style scoped>
.line-through {
    text-decoration: line-through;
}
</style>
