<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Simple Test Component</h1>
      <p class="mb-4">If you can see this, Vue is working!</p>
      <p class="mb-4">Count: {{ count }}</p>
      <button
        type="button"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="count++"
      >
        Increment
      </button>
    </div>
  </div>
</template>
