"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
  Home,
  ShoppingBag,
  CreditCard,
  User,
  Heart,
  MapPin,
  Settings,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard-nav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "CUSTOMER")) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null; // Parent layout will handle loading/redirect
  }

  const navItems = [
    {
      title: "Home",
      href: "/dashboard/customer",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "My Orders",
      href: "/dashboard/customer/orders",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Favorites",
      href: "/dashboard/customer/favorites",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      title: "Addresses",
      href: "/dashboard/customer/addresses",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      title: "Payment Methods",
      href: "/dashboard/customer/payment",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/customer/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/customer/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="container flex-1 flex gap-8 py-6">
      <aside className="hidden w-[200px] flex-shrink-0 md:block">
        <DashboardNav items={navItems} />
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
