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
      if (user.role === "DELIVERY_PERSON") {
        router.push("/dashboard/delivery-person");
      } else if (user.role === "RESTAURANT_OWNER") {
        router.push("/dashboard/restaurant");
      } else {
        router.push("/dashboard/customer");
      }
    }
  }, [user, isLoading, router]);

  // Show loading while redirecting
  return (
    <div className="container py-10">
      <div className="flex h-40 items-center justify-center">
        <p className="text-lg font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
