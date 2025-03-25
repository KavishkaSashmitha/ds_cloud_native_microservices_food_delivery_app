"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, Clock, Home, Menu, Package, Settings, ShoppingBag, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderStatusBadge } from "./components/order-status-badge"
import { RevenueChart } from "./components/revenue-chart"
import { OrdersChart } from "./components/orders-chart"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <div
        className={`fixed inset-y-0 z-50 w-full shrink-0 border-r bg-background md:static md:w-auto ${sidebarOpen ? "flex" : "hidden md:flex"} flex-col`}
      >
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>FoodCloud Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
        <nav className="grid gap-2 p-4 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Menu className="h-4 w-4" />
            Menu
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Users className="h-4 w-4" />
            Customers
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          <Button variant="outline" size="sm">
            View Store
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,543.00</div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+342</div>
                <p className="text-xs text-muted-foreground">+8.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+78</div>
                <p className="text-xs text-muted-foreground">+12.4% from last month</p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue</CardTitle>
                    <CardDescription>Revenue over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RevenueChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Orders over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrdersChart />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Recent orders from your customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#3210</TableCell>
                          <TableCell>John Smith</TableCell>
                          <TableCell>March 18, 2023</TableCell>
                          <TableCell>$42.25</TableCell>
                          <TableCell>
                            <OrderStatusBadge status="delivered" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#3209</TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                          <TableCell>March 18, 2023</TableCell>
                          <TableCell>$28.50</TableCell>
                          <TableCell>
                            <OrderStatusBadge status="preparing" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#3208</TableCell>
                          <TableCell>Michael Brown</TableCell>
                          <TableCell>March 17, 2023</TableCell>
                          <TableCell>$35.75</TableCell>
                          <TableCell>
                            <OrderStatusBadge status="delivered" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#3207</TableCell>
                          <TableCell>Emily Davis</TableCell>
                          <TableCell>March 17, 2023</TableCell>
                          <TableCell>$18.99</TableCell>
                          <TableCell>
                            <OrderStatusBadge status="out-for-delivery" />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#3206</TableCell>
                          <TableCell>Robert Wilson</TableCell>
                          <TableCell>March 16, 2023</TableCell>
                          <TableCell>$52.30</TableCell>
                          <TableCell>
                            <OrderStatusBadge status="delivered" />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Detailed analytics coming soon</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics dashboard under development</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and download reports</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">Reports feature coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

