<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ErrorBoundary from './components/ErrorBoundary.vue'
import AuthProvider from './components/AuthProvider.vue'
import UserMenu from './components/UserMenu.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <ErrorBoundary>
    <AuthProvider>
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="max-w-4xl mx-auto px-4 py-4">
            <nav class="flex items-center justify-between">
              <h1 class="text-xl font-bold text-gray-900">Todo App</h1>
              <div class="flex items-center space-x-4">
                <RouterLink
                  to="/"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </RouterLink>
                <UserMenu />
              </div>
            </nav>
          </div>
        </header>

        <main>
          <RouterView />
        </main>
      </div>
      <ToastContainer />
    </AuthProvider>
  </ErrorBoundary>
</template>
