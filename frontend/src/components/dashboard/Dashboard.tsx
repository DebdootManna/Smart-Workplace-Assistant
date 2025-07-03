"use client"

import { useState } from "react"
import { useAuth } from "../../app/providers"
import { DashboardOverview } from "./DashboardOverview"
import { TaskManager } from "./TaskManager"
import { AIAssistant } from "./AIAssistant"
import { Analytics } from "./Analytics"
import { motion } from "framer-motion"
import { LayoutDashboard, CheckSquare, Bot, BarChart3, LogOut, User, Menu, X } from "lucide-react"

type TabType = "overview" | "tasks" | "ai" | "analytics"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tabs = [
    { id: "overview" as TabType, name: "Overview", icon: LayoutDashboard },
    { id: "tasks" as TabType, name: "Tasks", icon: CheckSquare },
    { id: "ai" as TabType, name: "AI Assistant", icon: Bot },
    { id: "analytics" as TabType, name: "Analytics", icon: BarChart3 },
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold gradient-text">Smart Assistant</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false)
                }}
                className={`
                  w-full flex items-center px-3 py-3 mb-2 text-left rounded-lg transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab === "ai" ? "AI Assistant" : activeTab}
            </h2>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="text-sm text-gray-500">Welcome back, {user?.full_name?.split(" ")[0]}!</div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
