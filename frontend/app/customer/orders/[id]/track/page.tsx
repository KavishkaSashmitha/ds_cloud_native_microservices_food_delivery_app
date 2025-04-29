"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useCustomer } from "@/contexts/customer-context";
import { useToast } from "@/hooks/use-toast";
import DeliveryTracking from "@/components/delivery-tracking";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function TrackOrderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    getOrderById,
    currentOrder,
    trackOrder,
    stopTracking,
    driverLocation,
  } = useCustomer();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrderAndDeliveryInfo = async () => {
      try {
        // Fetch order details using our customer context
        const orderData = await getOrderById(id as string);
        if (orderData) {
          setOrder(orderData);

          // If the order has a delivery ID, set it for tracking
          if (orderData.deliveryId) {
            setDeliveryId(orderData.deliveryId);
            // Start tracking the order
            trackOrder(orderData.id);
          }
        } else {
          throw new Error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load order tracking information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndDeliveryInfo();

    // Clean up tracking when component unmounts
    return () => {
      if (id) {
        stopTracking(id as string);
      }
    };
  }, [id, toast, getOrderById, trackOrder, stopTracking]);

  // Update local state when current order changes
  useEffect(() => {
    if (currentOrder && currentOrder.id === id) {
      setOrder(currentOrder);
      if (currentOrder.deliveryId && !deliveryId) {
        setDeliveryId(currentOrder.deliveryId);
      }
    }
  }, [currentOrder, id, deliveryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no delivery has been created yet or order is in early status
  if (!deliveryId && ["pending", "confirmed"].includes(order.status)) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Order #{id}</h2>
            <p className="text-gray-600 mb-6">
              Your order is being processed. Live tracking will be available
              once your order is ready for delivery.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>Refresh</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If the order is delivered or cancelled
  if (["delivered", "cancelled"].includes(order.status)) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Order #{id} -{" "}
              {order.status === "delivered" ? "Delivered" : "Cancelled"}
            </h2>
            <p className="text-gray-600 mb-6">
              {order.status === "delivered"
                ? "This order has been delivered. Thank you for using our service!"
                : "This order has been cancelled."}
            </p>
            <Button onClick={() => window.history.back()}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we have the delivery ID, show the tracking component
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {deliveryId ? (
        <DeliveryTracking
          deliveryId={deliveryId}
          orderId={id as string}
          initialStatus={order.status}
          driverLocation={driverLocation} // Pass driver location from context
          driver={order.driver} // Pass driver info
          estimatedDeliveryTime={order.estimatedDeliveryTime} // Pass ETA
        />
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Tracking Unavailable</h2>
            <p className="text-gray-600 mb-6">
              Live tracking information is not available for this order yet.
              Please check back later.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
