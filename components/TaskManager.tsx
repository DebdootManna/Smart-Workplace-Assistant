"use client"

import { useState } from "react"

interface Task {
  id: number
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed"
  due_date?: string
  created_at: string
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete project proposal",
      description: "Draft and finalize the Q1 project proposal",
      priority: "high",
      status: "in_progress",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      title: "Review team performance",
      description: "Conduct quarterly performance reviews",
      priority: "medium",
      status: "pending",
      created_at: "2024-01-14",
    },
    {
      id: 3,
      title: "Update documentation",
      description: "Update API documentation for new features",
      priority: "low",
      status: "completed",
      created_at: "2024-01-13",
    },
  ])

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅"
      case "in_progress":
        return "⏳"
      default:
        return "⭕"
    }
  }

  const toggleTaskStatus = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : ("completed" as any) } : task,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600">Organize and track your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          ➕ Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-1 text-xl hover:scale-110 transition-transform"
                  >
                    {getStatusIcon(task.status)}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                    >
                      {task.title}
                    </h3>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}

                    <div className="flex items-center mt-3 space-x-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">{task.status.replace("_", " ")}</span>
                      <span className="text-xs text-gray-500">📅 {task.created_at}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    ✏️
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "Create your first task to get started"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                ➕ Create Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
