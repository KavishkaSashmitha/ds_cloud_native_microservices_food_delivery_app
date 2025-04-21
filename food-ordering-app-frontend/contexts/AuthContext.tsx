"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { User, UserRole, RegisterUserData } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        console.log("Initial auth check, token exists:", !!token);

        if (token) {
          try {
            // Store token in a cookie for middleware to access
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;

            const response = await authApi.getCurrentUser();
            console.log("Current user response:", response);

            if (response.success && response.data) {
              console.log("Setting user from auth check:", response.data);
              setUser(response.data);
            } else {
              console.warn("Invalid user data format");
              handleLogout();
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Helper function to handle logout cleanup
  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
  };

  // Helper function to determine dashboard path based on user role
  const getDashboardPathForRole = (role: UserRole): string => {
    switch (role) {
      case "RESTAURANT_OWNER":
        return "/dashboard/restaurant";
      case "DELIVERY_PERSON":
        return "/dashboard/delivery-person";
      default:
        return "/dashboard";
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login for:", email);

      const response = await authApi.login(email, password);
      console.log("Login response:", response);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }

      // Verify we received both token and user
      if (!response.data.token) {
        console.error("No token received in login response");
        throw new Error("Authentication failed: No token received");
      }

      if (!response.data.user) {
        console.error("No user data received in login response");
        throw new Error("Authentication failed: No user data received");
      }

      // Store token in both localStorage and cookies
      localStorage.setItem("token", response.data.token);
      document.cookie = `token=${response.data.token}; path=/; max-age=86400; SameSite=Strict`;

      // Set user in state
      setUser(response.data.user);
      console.log("User set after login:", response.data.user);

      // Get dashboard path based on role
      const dashboardPath = getDashboardPathForRole(response.data.user.role);
      console.log("Will navigate to:", dashboardPath);

      // Use Next.js router for client-side navigation
      router.push(dashboardPath);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || error.message || "Login failed"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Registering user:", userData);

      const response = await authApi.register(userData);
      console.log("Register response:", response);

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      // Auto login after successful registration
      console.log("Registration successful, attempting login");
      await login(userData.email, userData.password);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || error.message || "Registration failed"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Even if API call fails, clean up local state and navigate
      handleLogout();
      router.push("/auth/login");
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
