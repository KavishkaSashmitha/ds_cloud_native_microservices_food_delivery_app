"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Truck,
  User,
  X,
} from "lucide-react"

import { useAuth } from "@/lib/auth-provider"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
  roles: Array<"customer" | "restaurant" | "delivery">
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    roles: ["customer", "restaurant", "delivery"],
  },
  {
    title: "Browse Restaurants",
    href: "/dashboard/restaurants",
    icon: <Store className="h-5 w-5" />,
    roles: ["customer"],
  },
  {
    title: "My Orders",
    href: "/dashboard/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
    roles: ["customer"],
  },
  {
    title: "Restaurant Profile",
    href: "/dashboard/restaurant-profile",
    icon: <Store className="h-5 w-5" />,
    roles: ["restaurant"],
  },
  {
    title: "Menu Management",
    href: "/dashboard/menu-management",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ["restaurant"],
  },
  {
    title: "Menu Categories",
    href: "/dashboard/menu-categories",
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ["restaurant"],
  },
  {
    title: "Incoming Orders",
    href: "/dashboard/incoming-orders",
    icon: <Package className="h-5 w-5" />,
    roles: ["restaurant"],
  },
  {
    title: "Available Deliveries",
    href: "/dashboard/available-deliveries",
    icon: <Truck className="h-5 w-5" />,
    roles: ["delivery"],
  },
  {
    title: "My Deliveries",
    href: "/dashboard/my-deliveries",
    icon: <Package className="h-5 w-5" />,
    roles: ["delivery"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["customer", "restaurant", "delivery"],
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    // Close mobile nav when route changes
    setIsMobileNavOpen(false)
  }, [pathname])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !localStorage.getItem("user")) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return null // Don't render anything while checking authentication
  }

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "customer":
        return "Customer"
      case "restaurant":
        return "Restaurant Admin"
      case "delivery":
        return "Delivery Personnel"
      default:
        return role
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(true)} className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
              <span>FoodExpress</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-sm md:flex">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
              <span>FoodExpress</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)} className="ml-auto">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
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
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
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
          <div className="container p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
