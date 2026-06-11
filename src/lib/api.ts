import axios from 'axios'
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  PaginatedResponse,
  TodoFilters,
} from '../types/todo'

const API_BASE_URL = 'https://api.oluwasetemi.dev'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const todoApi = {
  getTodos: async (
    page = 1,
    limit = 10,
    filters?: TodoFilters,
  ): Promise<PaginatedResponse<Todo>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters?.search) {
      params.append('search', filters.search)
    }

    if (filters?.completed && filters.completed !== 'all') {
      params.append(
        'status',
        filters.completed === 'complete' ? 'COMPLETED' : 'TODO',
      )
    }

    const response = await api.get(`/tasks?${params.toString()}`)
    return response.data
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  createTodo: async (todoData: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post('/tasks', todoData)
    return response.data
  },

  updateTodo: async (
    id: string,
    todoData: UpdateTodoRequest,
  ): Promise<Todo> => {
    const response = await api.patch(`/tasks/${id}`, todoData)
    return response.data
  },

  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

export default api
