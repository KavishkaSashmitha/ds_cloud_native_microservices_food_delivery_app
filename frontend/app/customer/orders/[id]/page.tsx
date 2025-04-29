"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCustomer } from "@/contexts/customer-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Clock,
  Package,
  User,
  Star,
  Car,
  ChevronLeft,
} from "lucide-react";
import DeliveryMap from "@/components/delivery-map";
import Link from "next/link";
import { Order } from "@/lib/api";

export type CustomerContextType = {
  activeOrders: Order[];
  orderHistory: Order[];
  currentlyTrackedOrder: Order | null;
  trackOrder: (orderId: string) => void;
  stopTracking: () => void;
  isLoading: boolean;
};

// Status colors and labels
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

export default function CustomerOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const {
    activeOrders,
    orderHistory,
    currentlyTrackedOrder,
    trackOrder,
    stopTracking,
    isLoading,
  } = useCustomer();

  // Find the order from active orders or history
  const order =
    activeOrders.find((o) => o.id === orderId) ||
    orderHistory.find((o) => o.id === orderId) ||
    currentlyTrackedOrder;

  // Start tracking this order when the page loads
  useEffect(() => {
    if (orderId && !currentlyTrackedOrder) {
      trackOrder(orderId);
    }

    // Cleanup tracking when leaving the page
    return () => {
      stopTracking();
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-10">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button asChild variant="default">
            <Link href="/customer/orders">View All Orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isCompleted =
    order.status === "delivered" || order.status === "cancelled";

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/customer/orders">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
        </Button>
      </div>

      {/* Order information card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">
              Order #{order.id.split("-")[1]}
            </CardTitle>
            <Badge className={statusColors[order.status] || "bg-gray-500"}>
              {statusLabels[order.status] || "Unknown"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">{order.restaurantName}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Ordered{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <ul className="space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>

            <Separator />

            {/* Delivery Address */}
            <div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <p className="text-sm text-gray-600">
                    {order.customerAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* ETA if available */}
            {order.estimatedDeliveryTime && !isCompleted && (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 p-2 rounded-md">
                <Clock className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium">
                  Estimated delivery at {order.estimatedDeliveryTime}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery tracking section */}
      {!isCompleted && order.driverInfo && (
        <>
          {/* Driver Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Delivery Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.driverInfo.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 capitalize">
                      {order.driverInfo.vehicleType}
                    </span>
                    <span className="flex items-center text-sm text-amber-500">
                      {order.driverInfo.rating.toFixed(1)}
                      <Star className="h-3 w-3 fill-current ml-0.5" />
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex gap-2">
                  <Phone className="h-4 w-4" />
                  {order.driverInfo.phone}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <DeliveryMap
                currentLocation={order.driverLocation}
                orders={[]}
                currentOrder={{
                  id: order.id,
                  restaurantId: order.restaurantId,
                  restaurantName: order.restaurantName,
                  restaurantAddress: "Restaurant Address", // We don't have this data
                  restaurantLocation: {
                    // Place restaurant near the customer for demo
                    lat: order.customerLocation.lat - 0.005,
                    lng: order.customerLocation.lng - 0.001,
                  },
                  customerName: "You",
                  customerAddress: order.customerAddress,
                  customerLocation: order.customerLocation,
                  customerPhone: "",
                  items: order.items,
                  total: order.total,
                  status: order.status,
                  distance: 0,
                  estimatedTime: order.estimatedDeliveryTime || "15-20 min",
                  earnings: 0,
                  createdAt: order.createdAt,
                }}
                height={300}
                showDirections={true}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Order Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              "confirmed",
              "preparing",
              "ready_for_pickup",
              "out_for_delivery",
              "delivered",
            ].map((step, index) => {
              const isActive =
                [
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready_for_pickup",
                  "out_for_delivery",
                  "delivered",
                ].indexOf(order.status) >=
                [
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready_for_pickup",
                  "out_for_delivery",
                  "delivered",
                ].indexOf(step);

              return (
                <div key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                        isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < 4 && (
                      <div
                        className={`h-12 w-0.5 ${
                          isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="font-medium">{statusLabels[step]}</p>
                    <p className="text-sm text-gray-500">
                      {step === "confirmed" && "We've received your order"}
                      {step === "preparing" && "Your order is being prepared"}
                      {step === "ready_for_pickup" &&
                        "Your order is ready for pickup"}
                      {step === "out_for_delivery" &&
                        "Your order is on the way"}
                      {step === "delivered" && "Your order has been delivered"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Help Button */}
      <div className="flex justify-center">
        <Button variant="outline" className="flex gap-2">
          <Phone className="h-4 w-4" />
          Contact support
        </Button>
      </div>
    </div>
  );
}
