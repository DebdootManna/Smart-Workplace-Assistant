"use client"

import { useAuth } from "./providers"
import { LoginForm } from "../components/auth/LoginForm"
import { Dashboard } from "../components/dashboard/Dashboard"
import { motion } from "framer-motion"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Workplace Assistant...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">Smart Workplace Assistant</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered productivity platform that revolutionizes your workplace efficiency through personalized
              dashboards and intelligent insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <LoginForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="card p-6">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2">40% Faster</h3>
                <p className="text-gray-600">Reduce task switching time with AI-powered prioritization</p>
              </div>
              <div className="card p-6">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
                <p className="text-gray-600">Personalized recommendations based on your work patterns</p>
              </div>
              <div className="card p-6">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">Track productivity trends and optimize your workflow</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return <Dashboard />
}
