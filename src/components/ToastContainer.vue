<script setup lang="ts">
import { toasts, useToast } from '../composables/useToast'
import Toast from './Toast.vue'

const { removeToast } = useToast()
</script>

<template>
  <Teleport to="body">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="removeToast(toast.id)"
    />
  </Teleport>
</template>
