"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderHistoryCard } from "@/components/order-history-card"

// Mock order statuses
const orderStatuses = [
  { id: "all", name: "All Orders" },
  { id: "active", name: "Active" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
]

// Mock orders
const mockOrders = [
  {
    id: "ORD12345",
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    restaurant: {
      id: "1",
      name: "Burger Palace",
      image: "/placeholder.svg?height=60&width=60",
    },
    items: [
      { name: "Classic Cheeseburger", quantity: 2 },
      { name: "French Fries", quantity: 1 },
      { name: "Chocolate Milkshake", quantity: 2 },
    ],
    total: 38.5,
    status: "preparing", // pending, preparing, ready, out_for_delivery, delivered, cancelled
  },
  {
    id: "ORD12344",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    restaurant: {
      id: "2",
      name: "Pizza Heaven",
      image: "/placeholder.svg?height=60&width=60",
    },
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Garlic Bread", quantity: 1 },
    ],
    total: 22.48,
    status: "delivered",
  },
  {
    id: "ORD12343",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    restaurant: {
      id: "3",
      name: "Sushi Express",
      image: "/placeholder.svg?height=60&width=60",
    },
    items: [
      { name: "California Roll", quantity: 2 },
      { name: "Salmon Nigiri", quantity: 4 },
      { name: "Miso Soup", quantity: 1 },
    ],
    total: 42.95,
    status: "delivered",
  },
  {
    id: "ORD12342",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    restaurant: {
      id: "1",
      name: "Burger Palace",
      image: "/placeholder.svg?height=60&width=60",
    },
    items: [
      { name: "BBQ Bacon Burger", quantity: 1 },
      { name: "Onion Rings", quantity: 1 },
    ],
    total: 18.98,
    status: "cancelled",
  },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter orders based on active tab and search query
  const filteredOrders = mockOrders.filter((order) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && ["pending", "preparing", "ready", "out_for_delivery"].includes(order.status)) ||
      (activeTab === "completed" && order.status === "delivered") ||
      (activeTab === "cancelled" && order.status === "cancelled")

    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesSearch
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-gray-600">View and track your orders</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID or restaurant..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
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
                <Clock className="mb-2 h-10 w-10 text-gray-400" />
                <p className="mb-2 text-center text-lg font-medium">No orders found</p>
                <p className="mb-6 text-center text-gray-500">
                  {searchQuery
                    ? "Try a different search term"
                    : activeTab === "all"
                      ? "You haven't placed any orders yet"
                      : `You don't have any ${activeTab} orders`}
                </p>
                <Link href="/customer/dashboard">
                  <Button className="bg-orange-500 hover:bg-orange-600">Browse Restaurants</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderHistoryCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
