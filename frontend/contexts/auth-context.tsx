"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, User, UserRole } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
    additionalData?: Record<string, any>
  ) => Promise<void>;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth context provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check for existing user session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Validate token with backend
          try {
            await authApi.getCurrentUser();
          } catch (error) {
            // If token is invalid, clear user data
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Authentication status
  const isAuthenticated = !!user;

  // Role check function
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "customer",
    additionalData: Record<string, any> = {}
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Prepare registration data
      const userData = {
        name,
        email,
        password,
        role,
        ...additionalData,
      };

      // Send registration request
      const response = await authApi.register(userData);
      const { token, user } = response.data;

      // Save user data and token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });

      // Redirect based on role
      redirectBasedOnRole(role);
    } catch (error: any) {
      console.error("Registration failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again later.";

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Add debugging
      console.log("Attempting login with:", { email, password, role });

      // Create the credentials object
      const credentials = { email, password, role };
      console.log("Login credentials:", credentials);

      // Send login request with explicit content type header
      const response = await authApi.login(credentials);
      console.log("Login response received:", response);

      const { token, user } = response.data;

      // Save user data and token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });

      // Redirect based on role
      redirectBasedOnRole(user.role);
    } catch (error: any) {
      console.error("Login failed - Full error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role: UserRole): void => {
    if (role === "restaurant") {
      router.push("/restaurant/dashboard");
    } else if (role === "customer") {
      router.push("/customer/dashboard");
    } else if (role === "delivery") {
      router.push("/delivery/dashboard");
    } else if (role === "admin") {
      router.push("/admin/dashboard");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isLoading,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the UserRole type for use in other components
export { type UserRole };
