<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { User, LogOut, Menu, X } from '@lucide/vue'
import { useAuth } from '../composables/useAuthContext'
import { useLogout } from '../composables/useAuthQueries'

const { user } = useAuth()
const logoutMutation = useLogout()
const isMenuOpen = ref(false)

function handleLogout() {
  logoutMutation.mutate(undefined, {
    onSuccess: () => {
      isMenuOpen.value = false
    },
  })
}
</script>

<template>
  <div
    v-if="!user"
    class="flex items-center space-x-4"
  >
    <RouterLink
      to="/login"
      class="text-gray-600 hover:text-gray-900 transition-colors"
    >
      Sign In
    </RouterLink>
    <RouterLink
      to="/login?mode=register"
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign Up
    </RouterLink>
  </div>

  <div
    v-else
    class="relative"
  >
    <button
      type="button"
      class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      @click="isMenuOpen = !isMenuOpen"
    >
      <User class="w-5 h-5" />
      <span class="text-sm font-medium">{{ user.name || user.email }}</span>
      <X
        v-if="isMenuOpen"
        class="w-4 h-4"
      />
      <Menu
        v-else
        class="w-4 h-4"
      />
    </button>

    <div
      v-if="isMenuOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
    >
      <div class="px-4 py-2 border-b border-gray-200">
        <p class="text-sm font-medium text-gray-900">
          {{ user.name || 'User' }}
        </p>
        <p class="text-xs text-gray-500">{{ user.email }}</p>
      </div>

      <RouterLink
        to="/profile"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        @click="isMenuOpen = false"
      >
        Profile
      </RouterLink>

      <button
        type="button"
        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 disabled:opacity-50"
        :disabled="logoutMutation.isPending.value"
        @click="handleLogout"
      >
        <LogOut class="w-4 h-4" />
        <span>
          {{ logoutMutation.isPending.value ? 'Signing out...' : 'Sign Out' }}
        </span>
      </button>
    </div>
  </div>
</template>
