"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Clock, Package, ShoppingBag, Store, Truck } from "lucide-react"

import { useAuth } from "@/lib/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {user.name}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your account today.</p>
        </div>

        {user.role === "customer" && <CustomerDashboard />}
        {user.role === "restaurant" && <RestaurantDashboard />}
        {user.role === "delivery" && <DeliveryDashboard />}
      </div>
    </DashboardLayout>
  )
}

function CustomerDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">Order #1234 in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorite Restaurants</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Visited 5 times this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">Home, Office</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your recent food orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Burger King</p>
                <p className="text-sm text-muted-foreground">Double Whopper Meal</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$12.99</p>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Pizza Hut</p>
                <p className="text-sm text-muted-foreground">Large Pepperoni Pizza</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$18.50</p>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Subway</p>
                <p className="text-sm text-muted-foreground">Footlong Tuna Sub</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$8.99</p>
                <p className="text-sm text-muted-foreground">Last week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recommended Restaurants</CardTitle>
          <CardDescription>Based on your order history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Thai Express</p>
                  <p className="text-sm text-muted-foreground">Thai • 4.8 ★ • 0.8 miles</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="gap-1">
                View <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Sushi Palace</p>
                  <p className="text-sm text-muted-foreground">Japanese • 4.6 ★ • 1.2 miles</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="gap-1">
                View <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Taco Bell</p>
                  <p className="text-sm text-muted-foreground">Mexican • 4.2 ★ • 0.5 miles</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="gap-1">
                View <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RestaurantDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">+3 from yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Need confirmation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">3 categories</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$342.50</div>
          <p className="text-xs text-muted-foreground">+$42.20 from yesterday</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>Orders waiting for confirmation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Order #1234</p>
                <p className="text-sm text-muted-foreground">2x Burger, 1x Fries, 1x Coke</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Order #1235</p>
                <p className="text-sm text-muted-foreground">1x Pizza, 2x Garlic Bread</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order #1236</p>
                <p className="text-sm text-muted-foreground">3x Tacos, 1x Nachos</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Popular Items</CardTitle>
          <CardDescription>Your most ordered items today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Chicken Burger</p>
                  <p className="text-sm text-muted-foreground">12 orders today</p>
                </div>
              </div>
              <p className="font-medium">$8.99</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">French Fries</p>
                  <p className="text-sm text-muted-foreground">10 orders today</p>
                </div>
              </div>
              <p className="font-medium">$3.99</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Chocolate Milkshake</p>
                  <p className="text-sm text-muted-foreground">8 orders today</p>
                </div>
              </div>
              <p className="font-medium">$4.50</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DeliveryDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">+2 from yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">Order #1234 in progress</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Ready for pickup</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$42.50</div>
          <p className="text-xs text-muted-foreground">+$12.20 from yesterday</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Current Delivery</CardTitle>
          <CardDescription>Order in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order #1234</p>
                <p className="text-sm text-muted-foreground">Burger King • 2.3 miles away</p>
              </div>
              <Button>Navigate</Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Delivery Address:</p>
              <p className="text-sm text-muted-foreground">123 Main St, Apt 4B, New York, NY 10001</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Customer:</p>
              <p className="text-sm text-muted-foreground">John Doe • (555) 123-4567</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Order Items:</p>
              <p className="text-sm text-muted-foreground">2x Whopper, 1x Large Fries, 1x Coke</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Contact Customer</Button>
              <Button>Mark as Delivered</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Available Orders</CardTitle>
          <CardDescription>Orders ready for pickup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Pizza Hut • 1.5 miles</p>
                <p className="text-sm text-muted-foreground">Order #1235 • $5.50 delivery fee</p>
              </div>
              <Button size="sm">Accept</Button>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Taco Bell • 0.8 miles</p>
                <p className="text-sm text-muted-foreground">Order #1236 • $4.25 delivery fee</p>
              </div>
              <Button size="sm">Accept</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Subway • 2.1 miles</p>
                <p className="text-sm text-muted-foreground">Order #1237 • $6.00 delivery fee</p>
              </div>
              <Button size="sm">Accept</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
