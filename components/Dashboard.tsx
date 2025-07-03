"use client"

import { useState } from "react"
import { TaskManager } from "./TaskManager"
import { AIAssistant } from "./AIAssistant"
import { Analytics } from "./Analytics"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "ai" | "analytics">("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tabs = [
    { id: "overview" as const, name: "Overview", icon: "📊" },
    { id: "tasks" as const, name: "Tasks", icon: "✅" },
    { id: "ai" as const, name: "AI Assistant", icon: "🤖" },
    { id: "analytics" as const, name: "Analytics", icon: "📈" },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />
      case "tasks":
        return <TaskManager />
      case "ai":
        return <AIAssistant />
      case "analytics":
        return <Analytics />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0 flex flex-col
      `}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Assistant
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSidebarOpen(false)
              }}
              className={`
                w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group
                ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className="text-lg mr-3 transition-transform group-hover:scale-110">{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
              {activeTab === tab.id && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white font-semibold text-sm">{user?.full_name?.charAt(0) || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500 mr-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab === "ai" ? "AI Assistant" : activeTab}
            </h2>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-sm text-gray-500">Welcome back, {user?.full_name?.split(" ")[0] || "User"}! 👋</div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}

function DashboardOverview() {
  const stats = [
    {
      name: "Total Tasks",
      value: "12",
      icon: "🎯",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      name: "Completed",
      value: "8",
      icon: "✅",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      name: "In Progress",
      value: "3",
      icon: "⏳",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    { name: "Pending", value: "1", icon: "⚠️", color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-600" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">Good morning! 👋</h1>
        <p className="text-blue-100 text-lg">
          You have 1 pending task and 3 in progress. Your productivity score is 85%.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${stat.bgColor}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500 ml-1">from last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">➕</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Create Task</h3>
          <p className="text-gray-600 mb-6">Add a new task to your workflow</p>
          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Get Started
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📈</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">View Analytics</h3>
          <p className="text-gray-600 mb-6">Track your productivity trends</p>
          <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            View Details
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Assistant</h3>
          <p className="text-gray-600 mb-6">Get intelligent recommendations</p>
          <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Ask AI
          </button>
        </div>
      </div>
    </div>
  )
}
