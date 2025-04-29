"use client";

import { useState } from "react";
import { useCustomer } from "@/contexts/customer-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Search, ChevronRight, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Status colors for badges
const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  preparing: "bg-blue-600",
  ready_for_pickup: "bg-orange-500",
  out_for_delivery: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready for Pickup",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function CustomerOrdersPage() {
  const { orders } = useCustomer();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Separate orders into active and history
  const activeOrders = orders.filter(order => 
    !["delivered", "cancelled"].includes(order.status)
  );
  const orderHistory = orders.filter(order => 
    ["delivered", "cancelled"].includes(order.status)
  );

  // Filter orders based on active tab and search query
  const filteredActiveOrders = activeOrders.filter((order) => {
    return (
      order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const filteredOrderHistory = orderHistory.filter((order) => {
    return (
      order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-gray-600">Track and manage your food orders</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by restaurant or order ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="active"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {filteredActiveOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <ShoppingBag className="h-10 w-10 text-gray-400 mb-3" />
                <p className="mb-2 text-center text-lg font-medium">
                  No active orders
                </p>
                <p className="text-center text-gray-500 mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "You don't have any active orders at the moment"}
                </p>
                <Button asChild>
                  <Link href="/customer/restaurants">Order Food</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredActiveOrders.map((order) => (
                <Link key={order.id} href={`/customer/orders/${order.id}`}>
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {order.restaurantName}
                          </h3>
                          <Badge
                            className={
                              statusColors[order.status] || "bg-gray-500"
                            }
                          >
                            {statusLabels[order.status] || "Unknown"}
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-start gap-2 mb-2 text-sm text-gray-600">
                        <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>
                          Ordered{" "}
                          {new Date(order.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2 text-sm">
                          <div>
                            <span className="font-medium">Items: </span>
                            <span>
                              {order.items
                                .map(
                                  (item) => `${item.quantity} × ${item.name}`
                                )
                                .join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className="font-medium">
                          Rs. {order.total.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {filteredOrderHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <ShoppingBag className="h-10 w-10 text-gray-400 mb-3" />
                <p className="mb-2 text-center text-lg font-medium">
                  No order history
                </p>
                <p className="text-center text-gray-500 mb-4">
                  {searchQuery
                    ? "Try a different search term"
                    : "You haven't placed any orders yet"}
                </p>
                <Button asChild>
                  <Link href="/customer/restaurants">Order Food</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrderHistory.map((order) => (
                <Link key={order.id} href={`/customer/orders/${order.id}`}>
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {order.restaurantName}
                          </h3>
                          <Badge
                            className={
                              statusColors[order.status] || "bg-gray-500"
                            }
                          >
                            {statusLabels[order.status] || "Unknown"}
                          </Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-start gap-2 mb-2 text-sm text-gray-600">
                        <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>
                          Ordered{" "}
                          {new Date(order.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2 text-sm">
                          <div>
                            <span className="font-medium">Items: </span>
                            <span>
                              {order.items
                                .map(
                                  (item) => `${item.quantity} × ${item.name}`
                                )
                                .join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className="font-medium">
                          Rs. {order.total.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
