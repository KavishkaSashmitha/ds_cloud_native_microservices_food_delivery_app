"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Define user roles
export type UserRole = "customer" | "restaurant" | "delivery" | "admin"

// Define user interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  token: string
}

// Define auth context interface
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (userData: any, role: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to your Authentication Service
      // For now, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        role,
        token: "mock_jwt_token_" + Math.random().toString(36).substr(2, 9),
      }

      // Save user to state and localStorage
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Redirect based on role
      if (role === "restaurant") {
        router.push("/restaurant/dashboard")
      } else if (role === "customer") {
        router.push("/customer/dashboard")
      } else if (role === "delivery") {
        router.push("/delivery/dashboard")
      } else if (role === "admin") {
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: any, role: UserRole) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to your Authentication Service
      // For now, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // After registration, redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  }

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
