"use client";

import React from "react";
import { useDelivery } from "@/contexts/delivery-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Package } from "lucide-react";
import { Order } from "@/contexts/delivery-context";
import { useToast } from "@/components/ui/use-toast";

interface DeliveryOrderCardProps {
  order: Order;
  onSelect?: () => void;
  showActions?: boolean;
}

export function DeliveryOrderCard({
  order,
  onSelect,
  showActions = true,
}: DeliveryOrderCardProps) {
  const { acceptOrder, isLoading } = useDelivery();
  const { toast } = useToast();

  // Handle accepting an order
  const handleAccept = async () => {
    try {
      await acceptOrder(order.id);
      toast({
        title: "Order Accepted",
        description: `You accepted the delivery for ${order.restaurantName}`,
      });
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({
        title: "Error",
        description:
          "Could not accept this order. It might have been taken by another driver.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      onClick={onSelect}
      className={
        onSelect ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }
    >
      <CardContent className="p-5">
        <div className="grid grid-cols-3 gap-4">
          {/* Order details */}
          <div className="col-span-2 space-y-3">
            <div>
              <h3 className="font-medium text-lg">{order.restaurantName}</h3>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{order.restaurantAddress}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Delivery To:</h4>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{order.customerAddress}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{order.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{order.distance.toFixed(1)} km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Package className="h-4 w-4 text-gray-500" />
                <span>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </span>
              </div>
            </div>
          </div>

          {/* Earnings and CTA */}
          <div className="flex flex-col justify-between items-end">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600">Earnings</span>
              <span className="text-xl font-bold">
                Rs. {order.earnings.toFixed(2)}
              </span>
            </div>

            {showActions && (
              <Button
                className="w-full mt-4"
                onClick={handleAccept}
                disabled={isLoading}
              >
                Accept Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
