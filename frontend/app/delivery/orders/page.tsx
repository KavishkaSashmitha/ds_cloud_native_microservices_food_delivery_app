"use client";

import { useState } from "react";
import { useDelivery } from "@/contexts/delivery-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { DeliveryOrderCard } from "@/components/delivery-order-card";

export default function DeliveryOrdersPage() {
  const { availableOrders } = useDelivery();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("nearby");

  // Filter orders based on search query
  const filteredOrders = availableOrders.filter((order) => {
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Nearby orders are within 5km
  const nearbyOrders = filteredOrders.filter((order) => order.distance <= 5);

  // Further orders are more than 5km away
  const furtherOrders = filteredOrders.filter((order) => order.distance > 5);

  // Orders to display based on active tab
  const ordersToDisplay = activeTab === "nearby" ? nearbyOrders : furtherOrders;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Available Orders</h1>
        <p className="text-gray-600">
          Find and accept delivery orders in your area
        </p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, restaurant, or customer..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="nearby"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="nearby">
            Nearby Orders
            {nearbyOrders.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {nearbyOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="further">
            Further Orders
            {furtherOrders.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {furtherOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {ordersToDisplay.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertTriangle className="h-10 w-10 text-gray-400 mb-3" />
                <p className="mb-2 text-center text-lg font-medium">
                  No orders available
                </p>
                <p className="text-center text-gray-500">
                  {searchQuery
                    ? "Try a different search term"
                    : activeTab === "nearby"
                    ? "There are no orders near your location right now"
                    : "There are no orders in your broader area right now"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordersToDisplay.map((order) => (
                <DeliveryOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
