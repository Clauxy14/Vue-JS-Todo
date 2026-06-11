<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RouterLink } from 'vue-router'
import { Check, Edit, Trash2, Calendar, User } from '@lucide/vue'
import LoadingSpinner from './LoadingSpinner.vue'
import {
  useTodos,
  useToggleTodoStatus,
  useDeleteTodo,
} from '../composables/useTodos'
import type { TodoFilters } from '../types/todo'

const props = defineProps<{
  page: number
  filters?: TodoFilters
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const page = toRef(props, 'page')
const filters = toRef(props, 'filters')

const { data, isLoading, error } = useTodos(page, filters)

const todos = computed(() => data.value?.data ?? [])
const pagination = computed(() => data.value?.meta)

const toggleTodoMutation = useToggleTodoStatus()
const deleteTodoMutation = useDeleteTodo()

function handleToggleTodo(id: string, currentStatus: string) {
  toggleTodoMutation.mutate({ id, currentStatus })
}

function handleDeleteTodo(id: string) {
  if (window.confirm('Are you sure you want to delete this todo?')) {
    deleteTodoMutation.mutate(id)
  }
}

function reloadPage() {
  window.location.reload()
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
    v-else-if="error"
    class="text-center py-8"
  >
    <div class="text-red-600 mb-4">Failed to load todos</div>
    <button
      type="button"
      class="text-blue-600 hover:text-blue-800 underline"
      @click="reloadPage"
    >
      Try again
    </button>
  </div>

  <div
    v-else-if="!todos.length"
    class="text-center py-8"
  >
    <div class="text-gray-500">No todos found</div>
  </div>

  <div
    v-else
    class="space-y-4"
  >
    <div class="space-y-2">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3 flex-1">
            <button
              type="button"
              class="mt-1 shrink-0"
              :aria-label="
                todo.status === 'COMPLETED'
                  ? 'Mark as incomplete'
                  : 'Mark as complete'
              "
              @click="handleToggleTodo(todo.id, todo.status)"
            >
              <div
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  todo.status === 'COMPLETED'
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300 hover:border-blue-400',
                ]"
              >
                <Check
                  v-if="todo.status === 'COMPLETED'"
                  class="w-3 h-3 text-white"
                />
              </div>
            </button>
            <div class="flex-1 min-w-0">
              <h3
                :class="[
                  'text-lg font-medium truncate',
                  todo.status === 'COMPLETED'
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900',
                ]"
              >
                {{ todo.name }}
              </h3>
              <p
                v-if="todo.description"
                :class="[
                  'text-sm mt-1 line-clamp-2',
                  todo.status === 'COMPLETED'
                    ? 'text-gray-400'
                    : 'text-gray-600',
                ]"
              >
                {{ todo.description }}
              </p>
              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span class="flex items-center space-x-1">
                  <Calendar class="w-3 h-3" />
                  <span>
                    {{
                      todo.createdAt
                        ? new Date(todo.createdAt).toLocaleDateString()
                        : 'No date'
                    }}
                  </span>
                </span>
                <span
                  v-if="todo.owner"
                  class="flex items-center space-x-1"
                >
                  <User class="w-3 h-3" />
                  <span>{{ todo.owner }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <RouterLink
              :to="`/todos/${todo.id}`"
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              aria-label="View details"
            >
              <Edit class="w-4 h-4" />
            </RouterLink>
            <button
              type="button"
              class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Delete todo"
              @click="handleDeleteTodo(todo.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="pagination && pagination.totalPages > 1"
      class="flex justify-center items-center space-x-2 pt-4 border-t border-gray-200"
    >
      <button
        type="button"
        :disabled="!pagination.hasPreviousPage"
        class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        @click="emit('pageChange', page - 1)"
      >
        Previous
      </button>

      <span class="text-sm text-gray-600">
        Page {{ pagination.page }} of {{ pagination.totalPages }}
      </span>

      <button
        type="button"
        :disabled="!pagination.hasNextPage"
        class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        @click="emit('pageChange', page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
