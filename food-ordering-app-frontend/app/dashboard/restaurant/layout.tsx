"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
  Store,
  Utensils,
  FileText,
  Settings,
  BarChart3,
  Bell,
  User,
} from "lucide-react";
import { RestaurantProvider } from "@/lib/data-context";
import { DashboardNav } from "@/components/dashboard-nav";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "RESTAURANT_OWNER")) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null; // Parent layout will handle loading/redirect
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/restaurant",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Menu Management",
      href: "/dashboard/restaurant/menu",
      icon: <Utensils className="h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/dashboard/restaurant/orders",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Restaurant Profile",
      href: "/dashboard/restaurant/profile",
      icon: <Store className="h-4 w-4" />,
    },
    {
      title: "Notifications",
      href: "/dashboard/restaurant/notifications",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      title: "Account",
      href: "/dashboard/restaurant/account",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/restaurant/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <RestaurantProvider>
      <div className="container flex-1 flex gap-8 py-6">
        <aside className="hidden w-[200px] flex-shrink-0 md:block">
          <DashboardNav items={navItems} />
        </aside>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </RestaurantProvider>
  );
}
