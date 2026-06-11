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
    queryFn: () => todoApi.getTodos(toValue(page), 10, toValue(filters)),
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      const filteredTodos = data.data.filter((todo) => {
        const belongsToUser =
          !user.value || !todo.owner || todo.owner === user.value.id
        return belongsToUser
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
  return useQuery({
    queryKey: computed(() => ['todo', toValue(id)]),
    queryFn: () => todoApi.getTodoById(toValue(id)),
    enabled: computed(() => !!toValue(id)),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todoData: CreateTodoRequest) => todoApi.createTodo(todoData),
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
        name: '',
        description: null,
        start: null,
        end: null,
        duration: null,
        priority: 'LOW',
        archived: false,
        isDefault: null,
        parentId: null,
        children: '',
        owner: null,
        tags: null,
        completedAt: null,
      })
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
    },
  })
}
