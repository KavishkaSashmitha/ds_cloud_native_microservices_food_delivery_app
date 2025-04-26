"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderCard } from "@/components/order-card"

// Mock order statuses
const orderStatuses = [
  { id: "all", name: "All Orders" },
  { id: "pending", name: "Pending" },
  { id: "preparing", name: "Preparing" },
  { id: "ready", name: "Ready for Pickup" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
]

// Mock orders
const initialOrders = [
  {
    id: "ORD-1001",
    customerName: "John Doe",
    items: [
      { name: "Classic Burger", quantity: 2, price: 9.99 },
      { name: "French Fries", quantity: 1, price: 3.99 },
      { name: "Coca Cola", quantity: 2, price: 1.99 },
    ],
    total: 27.95,
    status: "pending",
    time: "10 minutes ago",
    address: "123 Main St, Apt 4B",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "ORD-1002",
    customerName: "Jane Smith",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Garden Salad", quantity: 1, price: 6.99 },
    ],
    total: 19.98,
    status: "preparing",
    time: "25 minutes ago",
    address: "456 Oak Ave",
    phone: "+1 (555) 987-6543",
  },
  {
    id: "ORD-1003",
    customerName: "Mike Johnson",
    items: [
      { name: "Chicken Wings", quantity: 2, price: 8.99 },
      { name: "Onion Rings", quantity: 1, price: 4.99 },
      { name: "Sprite", quantity: 1, price: 1.99 },
    ],
    total: 24.96,
    status: "ready",
    time: "40 minutes ago",
    address: "789 Pine St",
    phone: "+1 (555) 456-7890",
  },
  {
    id: "ORD-1004",
    customerName: "Sarah Williams",
    items: [
      { name: "Vegetable Pasta", quantity: 1, price: 11.99 },
      { name: "Garlic Bread", quantity: 1, price: 3.99 },
      { name: "Tiramisu", quantity: 1, price: 5.99 },
    ],
    total: 21.97,
    status: "completed",
    time: "1 hour ago",
    address: "321 Elm St",
    phone: "+1 (555) 234-5678",
  },
  {
    id: "ORD-1005",
    customerName: "David Brown",
    items: [
      { name: "Beef Tacos", quantity: 3, price: 7.99 },
      { name: "Guacamole", quantity: 1, price: 2.99 },
      { name: "Lemonade", quantity: 2, price: 1.99 },
    ],
    total: 30.93,
    status: "cancelled",
    time: "2 hours ago",
    address: "654 Maple Ave",
    phone: "+1 (555) 876-5432",
  },
]

export default function RestaurantOrders() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState(initialOrders)

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = activeTab === "all" || order.status === activeTab
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {orderStatuses.map((status) => (
            <TabsTrigger key={status.id} value={status.id}>
              {status.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="mb-2 text-center text-lg font-medium">No orders found</p>
                <p className="text-center text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "You don't have any orders yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
