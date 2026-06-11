<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Check,
  Trash2,
  Calendar,
  User,
} from '@lucide/vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { useTodo, useUpdateTodo, useDeleteTodo } from '../composables/useTodos'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data: todo, isLoading, error } = useTodo(id)
const updateTodoMutation = useUpdateTodo()
const deleteTodoMutation = useDeleteTodo()

const isEditing = ref(false)
const editedName = ref('')
const editedDescription = ref('')

function handleToggleComplete() {
  if (!todo.value) return
  updateTodoMutation.mutate({
    id: todo.value.id,
    todoData: {
      status: todo.value.status === 'COMPLETED' ? 'TODO' : 'COMPLETED',
    },
  })
}

function handleDelete() {
  if (!todo.value) return
  if (window.confirm('Are you sure you want to delete this todo?')) {
    deleteTodoMutation.mutate(todo.value.id, {
      onSuccess: () => {
        router.push('/')
      },
    })
  }
}

function handleEdit() {
  if (!todo.value) return
  editedName.value = todo.value.name
  editedDescription.value = todo.value.description || ''
  isEditing.value = true
}

function handleSave() {
  if (!todo.value) return
  updateTodoMutation.mutate({
    id: todo.value.id,
    todoData: {
      name: editedName.value,
      description: editedDescription.value,
    },
  })
  isEditing.value = false
}

function handleCancel() {
  isEditing.value = false
  editedName.value = ''
  editedDescription.value = ''
}
</script>

<template>
  <div
    v-if="isLoading"
    class="flex justify-center py-8"
  >
    <LoadingSpinner size="lg" />
  </div>

  <div
    v-else-if="error || !todo"
    class="text-center py-8"
  >
    <div class="text-red-600 mb-4">Failed to load todo details</div>
    <RouterLink
      to="/"
      class="text-blue-600 hover:text-blue-800 underline"
    >
      Back to todos
    </RouterLink>
  </div>

  <div
    v-else
    class="max-w-2xl mx-auto"
  >
    <div class="mb-6">
      <RouterLink
        to="/"
        class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to todos
      </RouterLink>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-start space-x-4 flex-1">
          <button
            type="button"
            class="mt-1 shrink-0"
            :aria-label="
              todo.status === 'COMPLETED'
                ? 'Mark as incomplete'
                : 'Mark as complete'
            "
            @click="handleToggleComplete"
          >
            <div
              :class="[
                'w-6 h-6 rounded border-2 flex items-center justify-center transition-colors',
                todo.status === 'COMPLETED'
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 hover:border-blue-400',
              ]"
            >
              <Check
                v-if="todo.status === 'COMPLETED'"
                class="w-4 h-4 text-white"
              />
            </div>
          </button>
          <div class="flex-1">
            <input
              v-if="isEditing"
              v-model="editedName"
              type="text"
              class="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
              autofocus
            >
            <h1
              v-else
              :class="[
                'text-2xl font-bold',
                todo.status === 'COMPLETED'
                  ? 'text-gray-500 line-through'
                  : 'text-gray-900',
              ]"
            >
              {{ todo.name }}
            </h1>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <template v-if="isEditing">
            <button
              type="button"
              class="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
              aria-label="Save changes"
              @click="handleSave"
            >
              <Save class="w-5 h-5" />
            </button>
            <button
              type="button"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
              aria-label="Cancel editing"
              @click="handleCancel"
            >
              <X class="w-5 h-5" />
            </button>
          </template>
          <button
            v-else
            type="button"
            class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            aria-label="Edit todo"
            @click="handleEdit"
          >
            <Edit2 class="w-5 h-5" />
          </button>
          <button
            type="button"
            class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete todo"
            :disabled="deleteTodoMutation.isPending.value"
            @click="handleDelete"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h2 class="text-sm font-medium text-gray-700 mb-2">Description</h2>
          <textarea
            v-if="isEditing"
            v-model="editedDescription"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a description..."
          />
          <p
            v-else
            :class="[
              'text-gray-600',
              todo.status === 'COMPLETED' ? 'line-through' : '',
            ]"
          >
            {{ todo.description || 'No description provided' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Status</h3>
            <span
              :class="[
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                todo.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800',
              ]"
            >
              {{ todo.status === 'COMPLETED' ? 'Completed' : 'In Progress' }}
            </span>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Created</h3>
            <div class="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar class="w-4 h-4" />
              <span>
                {{
                  todo.createdAt
                    ? new Date(todo.createdAt).toLocaleDateString()
                    : 'No date'
                }}
              </span>
            </div>
          </div>
          <div v-if="todo.updatedAt !== todo.createdAt">
            <h3 class="text-sm font-medium text-gray-700 mb-1">Updated</h3>
            <div class="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar class="w-4 h-4" />
              <span>
                {{
                  todo.updatedAt
                    ? new Date(todo.updatedAt).toLocaleDateString()
                    : 'No date'
                }}
              </span>
            </div>
          </div>
          <div v-if="todo.owner">
            <h3 class="text-sm font-medium text-gray-700 mb-1">User</h3>
            <div class="flex items-center space-x-1 text-sm text-gray-600">
              <User class="w-4 h-4" />
              <span>ID: {{ todo.owner }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
