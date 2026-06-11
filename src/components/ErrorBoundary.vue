<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

defineProps<{
  fallback?: unknown
}>()

const hasError = ref(false)
const error = ref<Error | undefined>()

onErrorCaptured((err) => {
  hasError.value = true
  error.value = err as Error
  console.error('Error caught by boundary:', err)
  return false
})

function reload() {
  window.location.reload()
}

function tryAgain() {
  hasError.value = false
  error.value = undefined
}
</script>

<template>
  <slot v-if="!hasError" />

  <div
    v-else-if="fallback"
    class="error-fallback"
  >
    <component :is="fallback" />
  </div>

  <div
    v-else
    class="min-h-screen flex items-center justify-center bg-gray-50"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center mb-4">
        <div class="mt-1 shrink-0">
          <svg
            class="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h1 class="text-lg font-medium text-gray-900">
            Something went wrong
          </h1>
        </div>
      </div>
      <div class="mb-4">
        <p class="text-sm text-gray-600">
          {{ error?.message || 'An unexpected error occurred' }}
        </p>
      </div>
      <div class="flex space-x-3">
        <button
          type="button"
          class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="reload"
        >
          Reload Page
        </button>
        <button
          type="button"
          class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          @click="tryAgain"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>
