<script setup lang="ts">
import { ref } from 'vue'
import ErrorTrigger from '../components/ErrorTrigger.vue'

const triggerError = ref(false)

function throwError() {
  triggerError.value = true
}
</script>

<template>
  <div class="max-w-md mx-auto px-4 py-8">
    <ErrorTrigger v-if="triggerError" />

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Error Boundary Test</h1>
      <p class="text-gray-600 mb-6">
        This page is used to test the ErrorBoundary component. Click the button below to trigger an error.
      </p>
      <button
        type="button"
        class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        @click="throwError"
      >
        Trigger Test Error
      </button>
    </div>
  </div>
</template>
