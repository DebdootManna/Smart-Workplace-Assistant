"use client"

import { useState, useEffect } from "react"
import { apiService, type Analytics, type Task } from "../../services/apiService"
import { motion } from "framer-motion"
import { CheckCircle, Clock, AlertCircle, TrendingUp, Plus, Calendar, Target } from "lucide-react"
import toast from "react-hot-toast"

export function DashboardOverview() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [analyticsData, tasksData] = await Promise.all([apiService.getAnalytics(), apiService.getTasks()])

      setAnalytics(analyticsData)
      setRecentTasks(tasksData.tasks.slice(0, 5)) // Show only recent 5 tasks
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  const stats = [
    {
      name: "Total Tasks",
      value: analytics?.stats.total_tasks || 0,
      icon: Target,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      name: "Completed",
      value: analytics?.stats.completed_tasks || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      name: "In Progress",
      value: analytics?.stats.in_progress_tasks || 0,
      icon: Clock,
      color: "bg-yellow-500",
      change: "+3%",
    },
    {
      name: "Pending",
      value: analytics?.stats.pending_tasks || 0,
      icon: AlertCircle,
      color: "bg-red-500",
      change: "-5%",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "in_progress":
        return "text-blue-600 bg-blue-50"
      case "pending":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Good morning! 👋</h1>
        <p className="text-blue-100">
          You have {analytics?.stats.pending_tasks || 0} pending tasks and {analytics?.stats.in_progress_tasks || 0} in
          progress. Your productivity score is {analytics?.productivity_score || 0}%.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last week</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    {task.due_date && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks yet. Create your first task to get started!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Create Task</h3>
          <p className="text-sm text-gray-600 mb-4">Add a new task to your workflow</p>
          <button className="btn btn-primary w-full">Get Started</button>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">View Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">Track your productivity trends</p>
          <button className="btn btn-secondary w-full">View Details</button>
        </div>

        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">AI Assistant</h3>
          <p className="text-sm text-gray-600 mb-4">Get intelligent recommendations</p>
          <button className="btn btn-secondary w-full">Ask AI</button>
        </div>
      </motion.div>
    </div>
  )
}
