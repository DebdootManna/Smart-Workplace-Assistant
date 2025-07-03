"use client"

import { useState } from "react"
import { LoginForm } from "@/components/LoginForm"
import { Dashboard } from "@/components/Dashboard"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    // Simulate login
    setTimeout(() => {
      setUser({
        id: 1,
        email: email,
        full_name: "Demo User",
      })
      setLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Workplace Assistant...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Smart Workplace Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered productivity platform that revolutionizes your workplace efficiency through personalized
              dashboards and intelligent insights.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <LoginForm onLogin={handleLogin} />
          </div>

          <div className="mt-12 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2">40% Faster</h3>
                <p className="text-gray-600">Reduce task switching time with AI-powered prioritization</p>
              </div>
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
                <p className="text-gray-600">Personalized recommendations based on your work patterns</p>
              </div>
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">Track productivity trends and optimize your workflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
