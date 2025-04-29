"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { useToast } from "@/hooks/use-toast";
import { io, Socket } from "socket.io-client";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "driver_assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options?: Array<{ name: string; value: string; price: number }>;
}

interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLocation: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "credit_card" | "cash";
  paymentStatus: "pending" | "completed" | "failed";
  paymentDetails?: {
    cardLast4: string;
    cardBrand: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number]; // [longitude, latitude]
    location: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  deliveryInstructions: string;
  specialInstructions: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
  deliveryId?: string;
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    rating: number;
  };
}

interface CustomerContextType {
  orders: Order[];
  currentOrder: Order | null;
  driverLocation: { lat: number; lng: number } | null;
  loadingOrders: boolean;
  fetchOrders: () => Promise<Order[]>;
  getOrderById: (id: string) => Promise<Order | null>;
  placeOrder: (orderData: any) => Promise<string>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  trackOrder: (orderId: string) => void;
  stopTracking: (orderId: string) => void;
  refreshOrderStatus: (orderId: string) => Promise<Order | null>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const { toast } = useToast();

  // Create a local getToken function that returns the token
  const getToken = useCallback(async () => {
    return token;
  }, [token]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  // Initialize socket connection for real-time updates
  useEffect(() => {
    if (!user) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const socketInstance = io(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Customer socket connected for real-time updates");
    });

    socketInstance.on("order_status_update", (data) => {
      if (data.userId === user?.id) {
        console.log("Order status update received:", data);
        // Update order in state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === data.orderId
              ? { ...order, status: data.status }
              : order
          )
        );

        // If this is the currently tracked order, update it
        if (currentOrder && currentOrder.id === data.orderId) {
          setCurrentOrder((prevOrder) =>
            prevOrder ? { ...prevOrder, status: data.status } : null
          );
        }

        // Show toast notification
        toast({
          title: "Order Update",
          description: `Order #${data.orderId.substring(
            0,
            8
          )} status: ${data.status.replace("_", " ")}`,
        });
      }
    });

    socketInstance.on("driver_assigned", (data) => {
      console.log("Driver assigned update received:", data);
      if (data.userId === user?.id) {
        // Update order with driver information
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === data.orderId
              ? {
                  ...order,
                  status: "driver_assigned",
                  deliveryId: data.deliveryId,
                  driver: data.driver,
                  estimatedDeliveryTime: data.estimatedDeliveryTime,
                }
              : order
          )
        );

        // If this is the currently tracked order, update it
        if (currentOrder && currentOrder.id === data.orderId) {
          setCurrentOrder((prevOrder) =>
            prevOrder
              ? {
                  ...prevOrder,
                  status: "driver_assigned",
                  deliveryId: data.deliveryId,
                  driver: data.driver,
                  estimatedDeliveryTime: data.estimatedDeliveryTime,
                }
              : null
          );
        }

        // Show toast notification
        toast({
          title: "Driver Assigned",
          description: `${data.driver.name} is on their way to pick up your order!`,
        });
      }
    });

    socketInstance.on("driver_location_update", (data) => {
      console.log("Driver location update:", data);
      if (trackedOrderId && data.orderId === trackedOrderId) {
        setDriverLocation({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      console.log("Closing customer socket connection");
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user, toast]);

  // Fetch all orders for the current user
  const fetchOrders = useCallback(async () => {
    if (!user) return [];

    setLoadingOrders(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/customer/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders);
      return data.orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoadingOrders(false);
    }
  }, [user, getToken, toast]);

  // Get a single order by ID
  const getOrderById = useCallback(
    async (id: string): Promise<Order | null> => {
      if (!user) return null;

      try {
        const token = await getToken();
        const response = await fetch(`/api/customer/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        // Update current order state if we're tracking this order
        if (trackedOrderId === id) {
          setCurrentOrder(data.order);
        }
        return data.order;
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
        return null;
      }
    },
    [user, getToken, toast, trackedOrderId]
  );

  // Place a new order with automatic driver assignment
  const placeOrder = useCallback(
    async (orderData: any): Promise<string> => {
      if (!user) throw new Error("You must be logged in to place an order");

      try {
        const token = await getToken();
        const response = await fetch("/api/customer/orders", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to place order");
        }

        const data = await response.json();

        // Add the new order to our local state
        const newOrder = data.order;
        setOrders((prevOrders) => [newOrder, ...prevOrders]);

        // Our backend will automatically assign a driver to this order
        // The socket will notify us when that happens

        return newOrder.id;
      } catch (error: any) {
        console.error("Error placing order:", error);
        throw new Error(error.message || "Failed to place order");
      }
    },
    [user, getToken]
  );

  // Cancel an order
  const cancelOrder = useCallback(
    async (orderId: string): Promise<boolean> => {
      if (!user) throw new Error("You must be logged in to cancel an order");

      try {
        const token = await getToken();
        const response = await fetch(`/api/customer/orders/${orderId}/cancel`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to cancel order");
        }

        // Update order status locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "cancelled" } : order
          )
        );

        // If this is the currently tracked order, update it
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder((prevOrder) =>
            prevOrder ? { ...prevOrder, status: "cancelled" } : null
          );
        }

        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled successfully",
        });

        return true;
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast({
          title: "Error",
          description: "Failed to cancel order",
          variant: "destructive",
        });
        return false;
      }
    },
    [user, getToken, toast, currentOrder]
  );

  // Start tracking a specific order for real-time updates
  const trackOrder = useCallback(
    (orderId: string) => {
      if (!socket || !orderId) return;

      console.log(`Tracking order: ${orderId}`);
      socket.emit("track_order", { orderId, userId: user?.id });
      setTrackedOrderId(orderId);

      // Get the initial order details
      getOrderById(orderId).then((order) => {
        if (order) {
          setCurrentOrder(order);
        }
      });
    },
    [socket, user, getOrderById]
  );

  // Stop tracking an order
  const stopTracking = useCallback(
    (orderId: string) => {
      if (!socket) return;

      console.log(`Stopping tracking for order: ${orderId}`);
      socket.emit("stop_tracking_order", { orderId });
      setTrackedOrderId(null);
      setCurrentOrder(null);
      setDriverLocation(null);
    },
    [socket]
  );

  // Refresh the status of a specific order
  const refreshOrderStatus = useCallback(
    async (orderId: string): Promise<Order | null> => {
      const order = await getOrderById(orderId);
      return order;
    },
    [getOrderById]
  );

  // Fetch orders when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user, fetchOrders]);

  const value = {
    orders,
    currentOrder,
    driverLocation,
    loadingOrders,
    fetchOrders,
    getOrderById,
    placeOrder,
    cancelOrder,
    trackOrder,
    stopTracking,
    refreshOrderStatus,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
