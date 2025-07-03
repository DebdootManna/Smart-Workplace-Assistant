"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "../services/authService"

interface User {
  id: number
  email: string
  full_name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = authService.getToken()
    if (token) {
      // Verify token and get user info
      const userData = authService.getCurrentUser()
      if (userData) {
        setUser(userData)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    setUser(response.user)
  }

  const register = async (email: string, password: string, fullName: string) => {
    const response = await authService.register(email, password, fullName)
    setUser(response.user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}
