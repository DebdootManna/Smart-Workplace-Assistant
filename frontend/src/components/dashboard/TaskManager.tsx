"use client"

import { useState, useEffect } from "react"
import { apiService, type Task } from "../../services/apiService"
import { TaskForm } from "./TaskForm"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Edit, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const loadTasks = async () => {
    try {
      const data = await apiService.getTasks()
      setTasks(data.tasks)
    } catch (error) {
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await apiService.createTask(taskData)
      toast.success("Task created successfully!")
      setShowTaskForm(false)
      loadTasks()
    } catch (error) {
      toast.error("Failed to create task")
    }
  }

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      await apiService.updateTask(taskId, updates)
      toast.success("Task updated successfully!")
      setEditingTask(null)
      loadTasks()
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await apiService.deleteTask(taskId)
      toast.success("Task deleted successfully!")
      loadTasks()
    } catch (error) {
      toast.error("Failed to delete task")
    }
  }

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed"
    await handleUpdateTask(task.id, { status: newStatus })
  }

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
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
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
        <button onClick={() => setShowTaskForm(true)} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input w-full sm:w-auto"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-1 hover:scale-110 transition-transform"
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

                        {task.due_date && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.estimated_hours}h estimated
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Create your first task to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                <button onClick={() => setShowTaskForm(true)} className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {(showTaskForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
            onClose={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
