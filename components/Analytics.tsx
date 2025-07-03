"use client"

import { useState } from "react"

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = [
    {
      name: "Productivity Score",
      value: "85%",
      change: "+5.2%",
      trend: "up",
      icon: "🎯",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Completion Rate",
      value: "78.5%",
      change: "+12.3%",
      trend: "up",
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Avg. Completion Time",
      value: "2.3h",
      change: "-8.1%",
      trend: "down",
      icon: "⏱️",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Total Tasks",
      value: "47",
      change: "+15.7%",
      trend: "up",
      icon: "📋",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const chartData = [
    { day: "Mon", completed: 4, created: 6 },
    { day: "Tue", completed: 3, created: 4 },
    { day: "Wed", completed: 6, created: 5 },
    { day: "Thu", completed: 2, created: 3 },
    { day: "Fri", completed: 5, created: 7 },
    { day: "Sat", completed: 1, created: 2 },
    { day: "Sun", completed: 3, created: 3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your productivity and performance metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? "📈" : "📉"} {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Trends Chart */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Task Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(data.created / 7) * 100}px` }}
                    title={`Created: ${data.created}`}
                  />
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(data.completed / 7) * 100}px` }}
                    title={`Completed: ${data.completed}`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Created</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 70%, 50% 50%)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ clipPath: "polygon(50% 50%, 100% 70%, 100% 100%, 20% 100%, 50% 50%)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"
                style={{ clipPath: "polygon(50% 50%, 20% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">47</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">37 (78%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <span className="text-sm font-medium text-gray-900">7 (15%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900">3 (7%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Strong Completion Rate</p>
                <p className="text-sm text-gray-600">You're completing 78% of your tasks, which is above average.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Room for Improvement</p>
                <p className="text-sm text-gray-600">
                  Consider breaking down larger tasks to improve completion times.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-900">Peak Performance</p>
                <p className="text-sm text-gray-600">Your productivity score of 85% shows excellent focus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
