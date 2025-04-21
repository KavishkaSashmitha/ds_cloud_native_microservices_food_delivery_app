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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
    roles: ["CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PERSON"],
  },
  {
    title: "Orders",
    icon: <Package className="h-5 w-5" />,
    href: "/dashboard/orders",
    roles: ["CUSTOMER", "RESTAURANT_OWNER"],
  },
  {
    title: "Order History",
    icon: <Clock className="h-5 w-5" />,
    href: "/dashboard/history",
    roles: ["CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PERSON"],
  },
  {
    title: "Restaurant Management",
    icon: <Store className="h-5 w-5" />,
    href: "/dashboard/restaurant",
    roles: ["RESTAURANT_OWNER"],
  },
  {
    title: "Deliveries",
    icon: <Bike className="h-5 w-5" />,
    href: "/dashboard/delivery",
    roles: ["DELIVERY_PERSON"],
  },
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
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    // Close mobile nav when route changes
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Remove loading state handling if not provided by useAuth

  if (!user) {
    return null; // Don't render anything while checking authentication
  }

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
        return "Restaurant Admin";
      case "DELIVERY_PERSON":
        return "Delivery Person";
      default:
        return role;
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
              href="/dashboard"
              className="flex items-center gap-2 font-bold text-xl text-primary"
            >
              <span>FoodExpress</span>
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
              href="/dashboard"
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
                    pathname === item.href
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
                  pathname === item.href
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
