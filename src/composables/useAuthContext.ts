import {
  inject,
  provide,
  computed,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import type { User } from '../types/auth'
import { useCurrentUser } from './useAuthQueries'

export interface AuthContext {
  user: Ref<User | null | undefined>
  isLoading: Ref<boolean>
  isAuthenticated: ComputedRef<boolean>
}

const AuthKey: InjectionKey<AuthContext> = Symbol('auth')

export function provideAuth() {
  const { data: user, isLoading, error } = useCurrentUser()

  watch(error, (err) => {
    if (err) {
      const errorStatus = (err as { response?: { status?: number } })?.response
        ?.status
      if (errorStatus === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    }
  })

  const context: AuthContext = {
    user,
    isLoading,
    isAuthenticated: computed(() => !!user.value),
  }

  provide(AuthKey, context)
  return context
}

export function useAuth() {
  const context = inject(AuthKey)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
