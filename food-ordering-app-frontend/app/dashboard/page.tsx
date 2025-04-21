"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard if they're on the generic one
      if (user.role === "RESTAURANT_OWNER") {
        router.push("/dashboard/restaurant");
      } else if (user.role === "DELIVERY_PERSON") {
        router.push("/dashboard/delivery");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // If not logged in, redirect to login page
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      {/* Add customer dashboard content here */}
    </div>
  );
}
