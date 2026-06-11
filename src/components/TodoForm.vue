<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X } from '@lucide/vue'
import { useCreateTodo } from '../composables/useTodos'
import { useToast } from '../composables/useToast'
import type { CreateTodoRequest } from '../types/todo'

const emit = defineEmits<{
  success: []
}>()

const createTodoMutation = useCreateTodo()
const toast = useToast()
const isOpen = ref(false)
const title = ref('')
const description = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()

  if (!title.value.trim()) return

  const todoData: CreateTodoRequest = {
    name: title.value.trim(),
    description: description.value.trim() || null,
    status: 'TODO',
    priority: 'LOW',
    archived: false,
  }

  createTodoMutation.mutate(todoData, {
    onSuccess: () => {
      toast.success('Todo created successfully!')
      title.value = ''
      description.value = ''
      isOpen.value = false
      emit('success')
    },
    onError: () => {
      toast.error('Failed to create todo. Please try again.')
    },
  })
}

function handleCancel() {
  title.value = ''
  description.value = ''
  isOpen.value = false
}
</script>

<template>
  <button
    v-if="!isOpen"
    type="button"
    class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    @click="isOpen = true"
  >
    <Plus class="w-5 h-5" />
    <span>Add New Todo</span>
  </button>

  <div
    v-else
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Create New Todo</h2>
      <button
        type="button"
        class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        @click="handleCancel"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <form
      class="space-y-4"
      @submit="handleSubmit"
    >
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter todo title..."
          required
          autofocus
        >
      </div>

      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter todo description (optional)..."
        />
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!title.trim() || createTodoMutation.isPending.value"
          class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {{ createTodoMutation.isPending.value ? 'Creating...' : 'Create Todo' }}
        </button>
      </div>
    </form>
  </div>
</template>
