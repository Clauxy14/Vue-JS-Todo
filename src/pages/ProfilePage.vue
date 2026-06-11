<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft, Mail, Calendar, User as UserIcon } from '@lucide/vue'
import { useAuth } from '../composables/useAuthContext'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { user, isLoading } = useAuth()
</script>

<template>
  <div
    v-if="isLoading"
    class="flex justify-center py-8"
  >
    <LoadingSpinner size="lg" />
  </div>

  <div
    v-else-if="!user"
    class="text-center py-8"
  >
    <div class="text-red-600 mb-4">Please log in to view your profile</div>
    <RouterLink
      to="/login"
      class="text-blue-600 hover:text-blue-800 underline"
    >
      Sign In
    </RouterLink>
  </div>

  <div
    v-else
    class="max-w-2xl mx-auto px-4 py-8"
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
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <UserIcon class="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ user.name || 'User' }}
          </h1>
          <p class="text-gray-600">Profile Information</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Name</h3>
            <div class="flex items-center space-x-2">
              <UserIcon class="w-4 h-4 text-gray-400" />
              <span class="text-gray-900">
                {{ user.name || 'Not provided' }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Email</h3>
            <div class="flex items-center space-x-2">
              <Mail class="w-4 h-4 text-gray-400" />
              <span class="text-gray-900">{{ user.email }}</span>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">User ID</h3>
            <span class="text-sm text-gray-600 font-mono">{{ user.id }}</span>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-1">Member Since</h3>
            <div class="flex items-center space-x-2">
              <Calendar class="w-4 h-4 text-gray-400" />
              <span class="text-gray-900">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="user.updatedAt !== user.createdAt"
          class="pt-4 border-t border-gray-200"
        >
          <h3 class="text-sm font-medium text-gray-700 mb-1">Last Updated</h3>
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4 text-gray-400" />
            <span class="text-gray-900">
              {{ new Date(user.updatedAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          This is your profile page. In a real application, you could update your profile information,
          change your password, or manage your account settings here.
        </div>
      </div>
    </div>
  </div>
</template>
