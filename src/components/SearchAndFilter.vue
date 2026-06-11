<script setup lang="ts">
import { Search, Filter } from '@lucide/vue'
import type { TodoFilters } from '../types/todo'

const props = defineProps<{
  filters: TodoFilters
}>()

const emit = defineEmits<{
  filtersChange: [filters: TodoFilters]
}>()

function handleSearchChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('filtersChange', {
    ...props.filters,
    search: target.value,
  })
}

function handleStatusChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('filtersChange', {
    ...props.filters,
    completed: target.value as 'all' | 'complete' | 'incomplete',
  })
}

function clearFilters() {
  emit('filtersChange', {
    search: '',
    completed: 'all',
  })
}

const hasActiveFilters = () =>
  props.filters.search || props.filters.completed !== 'all'
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            :value="filters.search || ''"
            placeholder="Search todos..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @input="handleSearchChange"
          >
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter class="h-5 w-5 text-gray-400" />
          </div>
          <select
            :value="filters.completed || 'all'"
            class="appearance-none block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="handleStatusChange"
          >
            <option value="all">All Status</option>
            <option value="incomplete">In Progress</option>
            <option value="complete">Completed</option>
          </select>
        </div>

        <button
          v-if="hasActiveFilters()"
          type="button"
          class="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          @click="clearFilters"
        >
          Clear
        </button>
      </div>
    </div>

    <div
      v-if="hasActiveFilters()"
      class="mt-3 flex flex-wrap gap-2"
    >
      <span
        v-if="filters.search"
        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
      >
        Search: {{ filters.search }}
      </span>
      <span
        v-if="filters.completed !== 'all'"
        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
      >
        Status: {{ filters.completed === 'complete' ? 'Completed' : 'In Progress' }}
      </span>
    </div>
  </div>
</template>
