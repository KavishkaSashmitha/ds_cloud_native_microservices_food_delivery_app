"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Types
export interface DeliveryOrder {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName?: string;
  customerAddress: string;
  items: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime?: string;
  distance?: string;
  amount: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";

export interface DeliveryPerson {
  id: string;
  userId: string;
  name: string;
  status: "AVAILABLE" | "BUSY" | "OFFLINE";
  currentLocation?: {
    lat: number;
    lng: number;
  };
  vehicleType?: "BIKE" | "CAR" | "SCOOTER";
  rating?: number;
  completedDeliveries: number;
}

interface DeliveryContextType {
  deliveryPerson: DeliveryPerson | null;
  availableOrders: DeliveryOrder[];
  activeDeliveries: DeliveryOrder[];
  pastDeliveries: DeliveryOrder[];
  isLoading: boolean;
  error: string | null;
  updateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  acceptDelivery: (orderId: string) => Promise<void>;
  updateLocation: (lat: number, lng: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(
  undefined
);

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(
    null
  );
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryOrder[]>([]);
  const [pastDeliveries, setPastDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch delivery person data on mount
  useEffect(() => {
    if (user && user.role === "DELIVERY_PERSON") {
      fetchDeliveryPersonData();
      fetchOrders();
    }
  }, [user]);

  // Mock data fetch functions - replace with actual API calls
  const fetchDeliveryPersonData = async () => {
    try {
      setIsLoading(true);
      // In a real app, fetch from API
      // const response = await api.get('/delivery/profile');

      // Mock data
      setDeliveryPerson({
        id: "dp-123",
        userId: user?._id || "",
        name: user?.username || "Delivery Person",
        status: "AVAILABLE",
        currentLocation: { lat: 6.9271, lng: 79.8612 },
        vehicleType: "BIKE",
        rating: 4.5,
        completedDeliveries: 157,
      });
    } catch (error) {
      console.error("Error fetching delivery person data:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // In a real app, fetch from API
      // const availableResponse = await api.get('/delivery/orders/nearby');
      // const activeResponse = await api.get('/delivery/orders/current');
      // const historyResponse = await api.get('/delivery/orders/history');

      // Mock data
      setAvailableOrders([
        {
          id: "order-1",
          restaurantName: "Pizza Hut",
          restaurantAddress: "123 Main St, Colombo 03",
          customerAddress: "456 Park Ave, Colombo 05",
          items: "1x Large Pepperoni Pizza, 2x Garlic Bread",
          status: "READY_FOR_PICKUP",
          createdAt: "2025-04-21T10:30:00Z",
          distance: "2.3 km",
          estimatedDeliveryTime: "15-20 min",
          amount: "Rs. 1,850",
          coordinates: { lat: 6.9271, lng: 79.8612 },
        },
        {
          id: "order-2",
          restaurantName: "McDonald's",
          restaurantAddress: "789 High St, Colombo 04",
          customerAddress: "101 Lake Side, Colombo 08",
          items: "2x Big Mac, 1x Large Fries",
          status: "READY_FOR_PICKUP",
          createdAt: "2025-04-21T10:25:00Z",
          distance: "3.5 km",
          estimatedDeliveryTime: "20-25 min",
          amount: "Rs. 1,200",
          coordinates: { lat: 6.9101, lng: 79.8528 },
        },
      ]);

      setActiveDeliveries([
        {
          id: "order-3",
          restaurantName: "KFC",
          restaurantAddress: "555 Liberty Plaza, Colombo 03",
          customerName: "John Silva",
          customerAddress: "777 Independence Ave, Colombo 07",
          items: "8pc Bucket, 2x Coleslaw, 1x Large Pepsi",
          status: "OUT_FOR_DELIVERY",
          createdAt: "2025-04-21T10:05:00Z",
          estimatedDeliveryTime: "10 min",
          amount: "Rs. 2,200",
          coordinates: { lat: 6.9165, lng: 79.8487 },
        },
      ]);

      setPastDeliveries([
        {
          id: "order-4",
          restaurantName: "Burger King",
          restaurantAddress: "222 Marine Drive, Colombo 03",
          customerAddress: "333 Flower Rd, Colombo 07",
          items: "1x Whopper, 1x Chicken Royale, 2x Fries",
          status: "DELIVERED",
          createdAt: "2025-04-20T15:30:00Z",
          amount: "Rs. 1,450",
        },
        {
          id: "order-5",
          restaurantName: "Domino's Pizza",
          restaurantAddress: "444 Galle Rd, Colombo 06",
          customerAddress: "555 Temple Rd, Colombo 10",
          items: "1x Medium Cheese Pizza, 1x Garlic Bread",
          status: "DELIVERED",
          createdAt: "2025-04-20T12:45:00Z",
          amount: "Rs. 950",
        },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const acceptDelivery = async (orderId: string) => {
    try {
      setIsLoading(true);
      // In a real app, make API call
      // await api.post(`/delivery/orders/${orderId}/accept`);

      // Mock implementation
      const orderToAccept = availableOrders.find(
        (order) => order.id === orderId
      );
      if (orderToAccept) {
        const updatedOrder = {
          ...orderToAccept,
          status: "OUT_FOR_DELIVERY" as OrderStatus,
        };
        setActiveDeliveries((prev) => [...prev, updatedOrder]);
        setAvailableOrders((prev) =>
          prev.filter((order) => order.id !== orderId)
        );
      }
    } catch (error) {
      console.error("Error accepting delivery:", error);
      setError("Failed to accept delivery");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setIsLoading(true);
      // In a real app, make API call
      // await api.patch(`/delivery/orders/${orderId}/status`, { status: newStatus });

      // Mock implementation
      if (newStatus === "PICKED_UP") {
        setActiveDeliveries((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else if (newStatus === "DELIVERED") {
        const orderToUpdate = activeDeliveries.find(
          (order) => order.id === orderId
        );
        if (orderToUpdate) {
          const updatedOrder = { ...orderToUpdate, status: newStatus };
          setPastDeliveries((prev) => [updatedOrder, ...prev]);
          setActiveDeliveries((prev) =>
            prev.filter((order) => order.id !== orderId)
          );
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (lat: number, lng: number) => {
    try {
      // In a real app, make API call
      // await api.put('/delivery/location', { lat, lng });

      // Update local state
      if (deliveryPerson) {
        setDeliveryPerson({
          ...deliveryPerson,
          currentLocation: { lat, lng },
        });
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  return (
    <DeliveryContext.Provider
      value={{
        deliveryPerson,
        availableOrders,
        activeDeliveries,
        pastDeliveries,
        isLoading,
        error,
        updateStatus,
        acceptDelivery,
        updateLocation,
        refreshOrders,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export const useDeliveryData = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error("useDeliveryData must be used within a DeliveryProvider");
  }
  return context;
};
