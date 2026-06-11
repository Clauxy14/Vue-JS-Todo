<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { X, CheckCircle, AlertCircle, Info } from '@lucide/vue'
import type { ToastType } from '../composables/useToast'

const props = withDefaults(
  defineProps<{
    message: string
    type: ToastType
    duration?: number
  }>(),
  {
    duration: 3000,
  },
)

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(true)
let hideTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined

function dismiss() {
  isVisible.value = false
  closeTimer = setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  hideTimer = setTimeout(dismiss, props.duration)
})

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
  if (closeTimer) clearTimeout(closeTimer)
})

const backgroundColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    case 'info':
      return 'bg-blue-50 border-blue-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
})
</script>

<template>
  <div
    :class="[
      'fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-lg transition-all duration-300 transform',
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      backgroundColor,
    ]"
    role="alert"
    aria-live="polite"
  >
    <div class="flex items-center space-x-3">
      <CheckCircle
        v-if="type === 'success'"
        class="w-5 h-5 text-green-600"
      />
      <AlertCircle
        v-else-if="type === 'error'"
        class="w-5 h-5 text-red-600"
      />
      <Info
        v-else-if="type === 'info'"
        class="w-5 h-5 text-blue-600"
      />
      <p class="text-sm font-medium text-gray-900">{{ message }}</p>
      <button
        type="button"
        class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
        @click="dismiss"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
