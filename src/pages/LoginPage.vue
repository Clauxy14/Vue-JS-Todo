<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Eye, EyeOff, Mail, Lock, User } from '@lucide/vue'
import { useLogin, useRegister } from '../composables/useAuthQueries'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const isRegister = computed(() => route.query.mode === 'register')

const formData = ref({
  email: '',
  password: '',
  name: '',
})
const showPassword = ref(false)
const errors = ref<Record<string, string>>({})

const loginMutation = useLogin()
const registerMutation = useRegister()
const isLoading = computed(
  () =>
    loginMutation.isPending.value || registerMutation.isPending.value,
)

function validateForm() {
  const newErrors: Record<string, string> = {}

  if (!formData.value.email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    newErrors.email = 'Email is invalid'
  }

  if (!formData.value.password) {
    newErrors.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }

  if (isRegister.value && !formData.value.name) {
    newErrors.name = 'Name is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

function handleMutationError(
  error: Error & { response?: { data?: { message?: string } } },
  fallback: string,
) {
  errors.value = {
    general: error.response?.data?.message || fallback,
  }
}

function handleSubmit(event: Event) {
  event.preventDefault()

  if (!validateForm()) return

  if (isRegister.value) {
    registerMutation.mutate(
      {
        email: formData.value.email,
        password: formData.value.password,
        name: formData.value.name,
        emailVerified: true,
        isActive: true,
      },
      {
        onSuccess: () => {
          router.push('/')
        },
        onError: (error) => {
          handleMutationError(error, 'Registration failed')
        },
      },
    )
  } else {
    loginMutation.mutate(
      {
        email: formData.value.email,
        password: formData.value.password,
      },
      {
        onSuccess: () => {
          router.push('/')
        },
        onError: (error) => {
          handleMutationError(error, 'Login failed')
        },
      },
    )
  }
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const { name, value } = target
  formData.value = { ...formData.value, [name]: value }
  if (errors.value[name]) {
    errors.value = { ...errors.value, [name]: '' }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isRegister ? 'Create your account' : 'Sign in to your account' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
          <RouterLink
            :to="isRegister ? '/login' : '/login?mode=register'"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            {{ isRegister ? 'Sign in' : 'Sign up' }}
          </RouterLink>
        </p>
      </div>

      <form
        class="mt-8 space-y-6"
        @submit="handleSubmit"
      >
        <div class="space-y-4">
          <div v-if="isRegister">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                :value="formData.name"
                class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your name"
                @input="handleInputChange"
              >
            </div>
            <p
              v-if="errors.name"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                :value="formData.email"
                class="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                @input="handleInputChange"
              >
            </div>
            <p
              v-if="errors.email"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                :autocomplete="isRegister ? 'new-password' : 'current-password'"
                :value="formData.password"
                class="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                @input="handleInputChange"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <EyeOff
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400"
                />
                <Eye
                  v-else
                  class="h-5 w-5 text-gray-400"
                />
              </button>
            </div>
            <p
              v-if="errors.password"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.password }}
            </p>
          </div>
        </div>

        <div
          v-if="errors.general"
          class="rounded-md bg-red-50 p-4"
        >
          <div class="text-sm text-red-800">{{ errors.general }}</div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LoadingSpinner
              v-if="isLoading"
              size="sm"
            />
            <span v-else>{{ isRegister ? 'Sign up' : 'Sign in' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
