"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "customer" | "restaurant" | "delivery"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: User["role"]) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This is a mock implementation. In a real app, you would call your API
      // For demo purposes, we'll simulate different user roles
      let mockUser: User

      if (email.includes("restaurant")) {
        mockUser = {
          id: "r1",
          name: "Restaurant Admin",
          email,
          role: "restaurant",
        }
      } else if (email.includes("delivery")) {
        mockUser = {
          id: "d1",
          name: "Delivery Person",
          email,
          role: "delivery",
        }
      } else {
        mockUser = {
          id: "c1",
          name: "Customer",
          email,
          role: "customer",
        }
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: User["role"]) => {
    setIsLoading(true)
    try {
      // This is a mock implementation. In a real app, you would call your API
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
