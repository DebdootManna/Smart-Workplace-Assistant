import axios from "axios"
import { authService } from "./authService"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = authService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout()
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export interface Task {
  id: number
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  due_date?: string
  created_at: string
  updated_at: string
  estimated_hours: number
  actual_hours: number
}

export interface Analytics {
  stats: {
    total_tasks: number
    completed_tasks: number
    in_progress_tasks: number
    pending_tasks: number
    avg_completion_time: number
  }
  trends: Array<{
    date: string
    tasks_created: number
    tasks_completed: number
  }>
  productivity_score: number
}

export interface AIResponse {
  response: string
  context_used: boolean
}

export interface AIInsights {
  insights: string[]
}

class ApiService {
  // Task management
  async getTasks(): Promise<{ tasks: Task[] }> {
    const response = await api.get("/tasks")
    return response.data
  }

  async createTask(task: Partial<Task>): Promise<{ message: string; task_id: number }> {
    const response = await api.post("/tasks", task)
    return response.data
  }

  async updateTask(taskId: number, updates: Partial<Task>): Promise<{ message: string }> {
    const response = await api.put(`/tasks/${taskId}`, updates)
    return response.data
  }

  async deleteTask(taskId: number): Promise<{ message: string }> {
    const response = await api.delete(`/tasks/${taskId}`)
    return response.data
  }

  // Analytics
  async getAnalytics(): Promise<Analytics> {
    const response = await api.get("/analytics")
    return response.data
  }

  // AI features
  async chatWithAI(query: string, context?: string): Promise<AIResponse> {
    const response = await api.post("/ai/chat", { query, context })
    return response.data
  }

  async getAIInsights(): Promise<AIInsights> {
    const response = await api.get("/ai/insights")
    return response.data
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await api.get("/health")
    return response.data
  }
}

export const apiService = new ApiService()
