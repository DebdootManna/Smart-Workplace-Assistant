"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../app/providers"
import { RegisterForm } from "./RegisterForm"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success("Welcome back!")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  if (!isLogin) {
    return <RegisterForm onBackToLogin={() => setIsLogin(true)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card p-8 max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full h-12 text-base">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Demo Account:</strong>
          <br />
          Email: demo@example.com
          <br />
          Password: password123
        </p>
      </div>
    </motion.div>
  )
}
