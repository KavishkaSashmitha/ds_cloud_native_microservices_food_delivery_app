"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Store,
  Package,
  Clock,
  Settings,
  LogOut,
  Menu,
  User,
  Bike,
  Utensils,
  FileText,
  BarChart3,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  Navigation,
  History,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define navigation items with proper role restrictions
const navItems = [
  // Common items for all roles
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
    roles: ["CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PERSON"],
  },

  // Customer-specific items
  {
    title: "My Orders",
    icon: <ShoppingBag className="h-5 w-5" />,
    href: "/dashboard/customer/orders",
    roles: ["CUSTOMER"],
  },
  {
    title: "Favorites",
    icon: <Heart className="h-5 w-5" />,
    href: "/dashboard/customer/favorites",
    roles: ["CUSTOMER"],
  },
  {
    title: "Addresses",
    icon: <MapPin className="h-5 w-5" />,
    href: "/dashboard/customer/addresses",
    roles: ["CUSTOMER"],
  },
  {
    title: "Payment Methods",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/dashboard/customer/payment",
    roles: ["CUSTOMER"],
  },

  // Restaurant Owner items
  {
    title: "Restaurant Profile",
    icon: <Store className="h-5 w-5" />,
    href: "/dashboard/restaurant/restaurant-profile",
    roles: ["RESTAURANT_OWNER"],
  },
  {
    title: "Menu Management",
    icon: <Utensils className="h-5 w-5" />,
    href: "/dashboard/restaurant/menu-management",
    roles: ["RESTAURANT_OWNER"],
  },
  {
    title: "Orders",
    icon: <FileText className="h-5 w-5" />,
    href: "/dashboard/restaurant/incoming-orders",
    roles: ["RESTAURANT_OWNER"],
  },
  {
    title: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/dashboard/restaurant/analytics",
    roles: ["RESTAURANT_OWNER"],
  },
  {
    title: "Notifications",
    icon: <Bell className="h-5 w-5" />,
    href: "/dashboard/restaurant/notifications",
    roles: ["RESTAURANT_OWNER"],
  },

  // Delivery Person items
  {
    title: "Available Orders",
    icon: <Navigation className="h-5 w-5" />,
    href: "/dashboard/delivery/available-deliveries",
    roles: ["DELIVERY_PERSON"],
  },
  {
    title: "Active Deliveries",
    icon: <Bike className="h-5 w-5" />,
    href: "/dashboard/delivery/active-deliveries",
    roles: ["DELIVERY_PERSON"],
  },
  {
    title: "Delivery Map",
    icon: <MapPin className="h-5 w-5" />,
    href: "/dashboard/delivery/map",
    roles: ["DELIVERY_PERSON"],
  },
  {
    title: "Delivery History",
    icon: <History className="h-5 w-5" />,
    href: "/dashboard/delivery/delivery-history",
    roles: ["DELIVERY_PERSON"],
  },

  // Common items at the end
  {
    title: "Profile",
    icon: <User className="h-5 w-5" />,
    href: "/dashboard/profile",
    roles: ["CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PERSON"],
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/dashboard/settings",
    roles: ["CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PERSON"],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    // Close mobile nav when route changes
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while checking authentication
  }

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "CUSTOMER":
        return "Customer";
      case "RESTAURANT_OWNER":
        return "Restaurant Owner";
      case "DELIVERY_PERSON":
        return "Delivery Person";
      default:
        return role;
    }
  };

  // Determine dashboard home based on role
  const getDashboardHome = () => {
    switch (user.role) {
      case "RESTAURANT_OWNER":
        return "/dashboard/restaurant";
      case "DELIVERY_PERSON":
        return "/dashboard/delivery-person";
      case "CUSTOMER":
        return "/dashboard/customer";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link
              href={getDashboardHome()}
              className="flex items-center gap-2 font-bold text-xl text-primary"
            >
              <span>FoodExpress</span>
              <span className="text-sm font-normal text-muted-foreground">
                {getRoleLabel(user.role)}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {user && getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <p className="font-medium">{user?.username}</p>
                <p className="text-muted-foreground text-xs">
                  {getRoleLabel(user?.role)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Link
              href={getDashboardHome()}
              className="flex items-center gap-2 font-bold text-xl text-primary"
              onClick={() => setIsMobileNavOpen(false)}
            >
              <span>FoodExpress</span>
            </Link>
          </div>
          <div className="flex h-full flex-col justify-between p-4">
            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-muted"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6 px-4 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
