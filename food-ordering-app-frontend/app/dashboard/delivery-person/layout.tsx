"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DeliveryProvider } from "@/contexts/DeliveryContext";

import {
  Package,
  MapPin,
  Navigation,
  History,
  User,
  Settings,
} from "lucide-react";
import { DashboardNav } from "@/components/dashboard-nav";

export default function DeliveryPersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "DELIVERY_PERSON")) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null; // Parent layout will handle loading/redirect
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/delivery-person",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Available Orders",
      href: "/dashboard/delivery-person/available-orders",
      icon: <Navigation className="h-4 w-4" />,
    },
    {
      title: "My Deliveries",
      href: "/dashboard/delivery-person/my-deliveries",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      title: "Delivery History",
      href: "/dashboard/delivery-person/delivery-history",
      icon: <History className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/delivery-person/profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/delivery-person/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <DeliveryProvider>
      <div className="container flex-1 flex gap-8 py-6">
        <aside className="hidden w-[200px] flex-shrink-0 md:block">
          <DashboardNav items={navItems} />
        </aside>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </DeliveryProvider>
  );
}
