import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { todoApi } from '../lib/api'
import type {
  CreateTodoRequest,
  TodoFilters,
  UpdateTodoRequest,
} from '../types/todo'
import { useAuth } from './useAuthContext'

export function useTodos(
  page: MaybeRefOrGetter<number> = 1,
  filters?: MaybeRefOrGetter<TodoFilters | undefined>,
) {
  const { user } = useAuth()

  return useQuery({
    queryKey: computed(() => [
      'todos',
      toValue(page),
      toValue(filters),
      user.value?.id,
    ]),
    queryFn: () =>
      todoApi.getTodos(toValue(page), 10, toValue(filters), user.value?.id),
    enabled: computed(() => !!user.value?.id),
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      const userId = user.value?.id
      const filteredTodos = data.data.filter((todo) => {
        if (!userId) return false
        return todo.owner === userId
      })

      return {
        ...data,
        data: filteredTodos,
        meta: {
          ...data.meta,
          total: filteredTodos.length,
          totalPages: Math.ceil(filteredTodos.length / 10),
        },
      }
    },
  })
}

export function useTodo(id: MaybeRefOrGetter<string>) {
  const { user } = useAuth()

  return useQuery({
    queryKey: computed(() => ['todo', toValue(id), user.value?.id]),
    queryFn: () => todoApi.getTodoById(toValue(id)),
    enabled: computed(() => !!toValue(id) && !!user.value?.id),
    staleTime: 5 * 60 * 1000,
    select: (todo) => {
      if (!user.value?.id || todo.owner !== user.value.id) {
        return undefined
      }
      return todo
    },
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (todoData: CreateTodoRequest) => {
      if (!user.value?.id) {
        throw new Error('Must be logged in to create todos')
      }

      return todoApi.createTodo({
        ...todoData,
        owner: user.value.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      todoData,
    }: {
      id: string
      todoData: UpdateTodoRequest
    }) => todoApi.updateTodo(id, todoData),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useToggleTodoStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string
      currentStatus: string
    }) => {
      const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED'

      return todoApi.updateTodo(id, {
        status: newStatus as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
      })
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
    },
  })
}
