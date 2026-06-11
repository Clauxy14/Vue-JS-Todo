<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuthContext'
import LoadingSpinner from './LoadingSpinner.vue'

const router = useRouter()
const { user, isLoading } = useAuth()

watch(
  [isLoading, user],
  () => {
    if (!isLoading.value && !user.value) {
      router.replace('/login')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="isLoading"
    class="min-h-screen flex items-center justify-center"
  >
    <LoadingSpinner size="lg" />
  </div>
  <slot v-else-if="user" />
</template>
