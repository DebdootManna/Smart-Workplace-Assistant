"use client"

import { useState, useEffect } from "react"
import { apiService, type Analytics as AnalyticsData } from "../../services/apiService"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const data = await apiService.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      toast.error("Failed to load analytics")
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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  const completionRate =
    analytics.stats.total_tasks > 0 ? (analytics.stats.completed_tasks / analytics.stats.total_tasks) * 100 : 0

  const pieData = [
    { name: "Completed", value: analytics.stats.completed_tasks, color: "#10B981" },
    { name: "In Progress", value: analytics.stats.in_progress_tasks, color: "#3B82F6" },
    { name: "Pending", value: analytics.stats.pending_tasks, color: "#6B7280" },
  ]

  const trendData = analytics.trends.map((trend) => ({
    date: new Date(trend.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    created: trend.tasks_created,
    completed: trend.tasks_completed,
  }))

  const stats = [
    {
      name: "Productivity Score",
      value: `${analytics.productivity_score}%`,
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      change: "+12.3%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Avg. Completion Time",
      value: `${analytics.stats.avg_completion_time?.toFixed(1) || 0}h`,
      change: "-8.1%",
      trend: "down",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Total Tasks",
      value: analytics.stats.total_tasks.toString(),
      change: "+15.7%",
      trend: "up",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your productivity and performance metrics</p>
        </div>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="input w-full sm:w-auto">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendIcon className={`w-4 h-4 mr-1 ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} name="Created" />
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="created" fill="#3B82F6" name="Tasks Created" />
              <Bar dataKey="completed" fill="#10B981" name="Tasks Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Strong Completion Rate</p>
                <p className="text-sm text-gray-600">
                  You're completing {completionRate.toFixed(0)}% of your tasks, which is above average.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Consistent Activity</p>
                <p className="text-sm text-gray-600">
                  You've been consistently creating and completing tasks over the past week.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Room for Improvement</p>
                <p className="text-sm text-gray-600">
                  Consider breaking down larger tasks to improve completion times.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Peak Performance</p>
                <p className="text-sm text-gray-600">
                  Your productivity score of {analytics.productivity_score}% shows excellent focus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
