"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  Clock,
  Package,
  TrendingUp,
  Wallet,
  Star,
  CheckCircle,
} from "lucide-react";
import { useDeliveryData } from "@/contexts/DeliveryContext";

export default function DeliveryPersonDashboard() {
  const {
    deliveryPerson,
    activeDeliveries,
    availableOrders,
    pastDeliveries,
    acceptDelivery,
    updateStatus,
  } = useDeliveryData();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { toast } = useToast();

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    try {
      await updateStatus(orderId, newStatus);
      toast({
        title: "Status Updated",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptDelivery(orderId);
      toast({
        title: "Order Accepted",
        description: "You have accepted the order for delivery",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {deliveryPerson?.name || "Delivery Partner"}
        </p>
      </div>

      {/* Status and Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div
              className={`h-4 w-4 rounded-full ${
                deliveryPerson?.status === "AVAILABLE"
                  ? "bg-green-500"
                  : deliveryPerson?.status === "BUSY"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryPerson?.status}</div>
            <p className="text-xs text-muted-foreground">
              {deliveryPerson?.status === "AVAILABLE"
                ? "Ready to accept orders"
                : deliveryPerson?.status === "BUSY"
                ? "Currently on delivery"
                : "Not accepting orders"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Earnings
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              {pastDeliveries.length} total deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deliveryPerson?.rating || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {deliveryPerson?.completedDeliveries || 0} deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Delivery Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Active Deliveries</h2>

        {activeDeliveries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activeDeliveries.map((delivery) => (
              <Card key={delivery.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {delivery.restaurantName}
                    </CardTitle>
                    <Badge
                      variant={
                        delivery.status === "OUT_FOR_DELIVERY"
                          ? "default"
                          : delivery.status === "PICKED_UP"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {delivery.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">Pickup:</span>
                      <span className="ml-1 text-muted-foreground">
                        {delivery.restaurantAddress}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">Dropoff:</span>
                      <span className="ml-1 text-muted-foreground">
                        {delivery.customerAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {delivery.items}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">
                        {delivery.estimatedDeliveryTime}
                      </span>
                    </div>
                    <div className="font-medium">{delivery.amount}</div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    {delivery.status === "OUT_FOR_DELIVERY" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(delivery.id, "PICKED_UP")
                        }
                      >
                        Mark Picked Up
                      </Button>
                    )}
                    {delivery.status === "PICKED_UP" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(delivery.id, "DELIVERED")
                        }
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No active deliveries at the moment
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Orders Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Available Orders</h2>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/delivery-person/available-orders">View All</a>
          </Button>
        </div>

        {availableOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableOrders.slice(0, 3).map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {order.restaurantName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {order.distance} away
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">
                      {order.items}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">
                        {order.estimatedDeliveryTime}
                      </span>
                    </div>
                    <div className="font-medium">{order.amount}</div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    Accept Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No available orders at the moment
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
