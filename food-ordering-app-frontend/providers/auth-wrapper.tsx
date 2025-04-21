"use client";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";

// Inner component that uses the auth context
function AuthContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only run this effect if not loading
    if (!isLoading) {
      // If trying to access dashboard without being logged in
      if (pathname.startsWith("/dashboard") && !user) {
        console.log(
          "Unauthorized dashboard access attempt, redirecting to login"
        );
        router.push("/auth/login");
      }

      // If trying to access auth pages while logged in
      if ((pathname.startsWith("/auth") || pathname === "/") && user) {
        console.log("User already logged in, redirecting to dashboard");
        // Get the appropriate dashboard based on role
        const dashboardPath =
          user.role === "RESTAURANT_OWNER"
            ? "/dashboard/restaurant"
            : user.role === "DELIVERY_PERSON"
            ? "/dashboard/delivery"
            : "/dashboard";
        router.push(dashboardPath);
      }
    }
  }, [isLoading, pathname, user, router]);

  // If loading authentication status, you could show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
}
