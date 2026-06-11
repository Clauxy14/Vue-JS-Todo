import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { authApi } from '../lib/auth'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../types/auth'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      queryClient.setQueryData(['user'], data.user)
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      queryClient.setQueryData(['user'], data.user)
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No token found')
      }
      return authApi.getCurrentUser()
    },
    enabled: !!localStorage.getItem('auth_token'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRefreshToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('refresh_token', data.refreshToken)
      queryClient.setQueryData(['user'], data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      queryClient.setQueryData(['user'], null)
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      queryClient.setQueryData(['user'], null)
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
