"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      const dashboardPath =
        user.role === "RESTAURANT_OWNER"
          ? "/dashboard/restaurant"
          : user.role === "DELIVERY_PERSON"
          ? "/dashboard/delivery-person"
          : "/dashboard/customer";

      router.push(dashboardPath);
    }
  }, [user, isLoading, router]);

  // Show loading while redirecting
  return (
    <div className="flex h-80 items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <h2 className="text-xl font-semibold">
          Redirecting to your dashboard...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we load your personalized dashboard
        </p>
      </div>
    </div>
  );
}
