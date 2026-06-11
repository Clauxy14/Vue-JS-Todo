<script setup lang="ts">
import { ref } from 'vue'
import TodoList from '../components/TodoList.vue'
import TodoForm from '../components/TodoForm.vue'
import SearchAndFilter from '../components/SearchAndFilter.vue'
import type { TodoFilters } from '../types/todo'

const page = ref(1)
const filters = ref<TodoFilters>({
  search: '',
  completed: 'all',
})

function handleFiltersChange(newFilters: TodoFilters) {
  filters.value = newFilters
  page.value = 1
}

function handleTodoCreated() {
  page.value = 1
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Todo Application</h1>
      <p class="text-gray-600">Manage your tasks efficiently</p>
    </div>

    <div class="space-y-6">
      <TodoForm @success="handleTodoCreated" />

      <SearchAndFilter
        :filters="filters"
        @filters-change="handleFiltersChange"
      />

      <TodoList
        :page="page"
        :filters="filters"
        @page-change="page = $event"
      />
    </div>
  </div>
</template>
