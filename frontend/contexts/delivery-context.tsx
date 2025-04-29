import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./auth-context";

// Types
export type OrderStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type DriverStatus = "offline" | "available" | "busy";

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLocation: {
    lat: number;
    lng: number;
  };
  customerName: string;
  customerAddress: string;
  customerLocation: {
    lat: number;
    lng: number;
  };
  customerPhone: string;
  items: Array<{ name: string; quantity: number }>;
  total?: number;
  status: OrderStatus;
  distance: number;
  estimatedTime: string;
  earnings: number;
  createdAt: string;
}

export interface EarningDetail {
  id: string;
  orderId: string;
  restaurantName: string;
  amount: number;
  date: string;
}

// Define delivery context interface
interface DeliveryContextType {
  status: DriverStatus;
  setStatus: (status: DriverStatus) => void;
  currentLocation: { lat: number; lng: number } | null;
  availableOrders: Order[];
  currentOrder: Order | null;
  orderHistory: Order[];
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    allTime: number;
    earnings: EarningDetail[];
  };
  isLoading: boolean;
  acceptOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string, reason: string) => Promise<void>;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  refreshOrders: () => Promise<void>;
}

// Create context
const DeliveryContext = createContext<DeliveryContextType | undefined>(
  undefined
);

// Get random coordinates near a given point
const getRandomNearbyCoords = (lat: number, lng: number, radiusKm = 5) => {
  // Earth's radius in km
  const earthRadius = 6371;

  // Convert radius from km to radians
  const radiusInRad = radiusKm / earthRadius;

  // Random angle
  const randomAngle = Math.random() * Math.PI * 2;

  // Random distance within radius
  const randomDist = Math.random() * radiusInRad;

  // Calculate new coordinates
  const newLat = lat + randomDist * Math.sin(randomAngle);
  const newLng = lng + randomDist * Math.cos(randomAngle);

  return { lat: newLat, lng: newLng };
};

// Calculate distance between two points
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Delivery provider component
export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [status, setStatus] = useState<DriverStatus>("offline");
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Earnings state
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    allTime: 0,
    earnings: [] as EarningDetail[],
  });

  // Location tracking
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with mock data when the component mounts
  useEffect(() => {
    // Set base location in Colombo, Sri Lanka
    const baseLocation = { lat: 6.9271, lng: 79.8612 };
    setCurrentLocation(baseLocation);

    // Create mock orders when driver is online
    if (status === "available") {
      const mockOrders: Order[] = Array.from({ length: 5 }, (_, i) => {
        const restaurantLocation = getRandomNearbyCoords(
          baseLocation.lat,
          baseLocation.lng,
          8
        );
        const customerLocation = getRandomNearbyCoords(
          restaurantLocation.lat,
          restaurantLocation.lng,
          5
        );

        const distance = calculateDistance(
          restaurantLocation.lat,
          restaurantLocation.lng,
          customerLocation.lat,
          customerLocation.lng
        );

        // Calculate earnings based on distance
        const earnings = 200 + distance * 100; // Base fee + per km fee

        return {
          id: `order-${Date.now()}-${i}`,
          restaurantId: `rest-${i}`,
          restaurantName: [
            "Burger Palace",
            "Pizza Planet",
            "Noodle House",
            "Curry Corner",
            "Sushi Express",
          ][i % 5],
          restaurantAddress: `${i * 100 + 100} Main St, Colombo`,
          restaurantLocation,
          customerName: ["Alex", "Sam", "Jordan", "Casey", "Taylor"][i % 5],
          customerAddress: `${i * 100 + 200} Park Ave, Colombo`,
          customerLocation,
          customerPhone: `077-${1000000 + i}`,
          items: [
            {
              name: ["Burger", "Pizza", "Noodles", "Curry", "Sushi"][i % 5],
              quantity: 1 + (i % 3),
            },
            {
              name: [
                "Fries",
                "Garlic Bread",
                "Spring Rolls",
                "Rice",
                "Miso Soup",
              ][i % 5],
              quantity: 1,
            },
          ],
          status: "pending" as OrderStatus,
          distance,
          estimatedTime: `${Math.ceil(distance * 5) + 10} min`,
          earnings,
          createdAt: new Date(Date.now() - i * 60000).toISOString(), // Orders staggered by 1 minute
        };
      });

      setAvailableOrders(mockOrders);
    } else {
      setAvailableOrders([]);
    }

    // Mock order history data
    const mockOrderHistory: Order[] = Array.from({ length: 10 }, (_, i) => {
      const restaurantLocation = getRandomNearbyCoords(
        baseLocation.lat,
        baseLocation.lng,
        8
      );
      const customerLocation = getRandomNearbyCoords(
        restaurantLocation.lat,
        restaurantLocation.lng,
        5
      );

      const distance = calculateDistance(
        restaurantLocation.lat,
        restaurantLocation.lng,
        customerLocation.lat,
        customerLocation.lng
      );

      const earnings = 200 + distance * 100;
      const status = i % 7 === 0 ? "cancelled" : "delivered";

      return {
        id: `past-order-${i}`,
        restaurantId: `rest-past-${i}`,
        restaurantName: [
          "Burger Palace",
          "Pizza Planet",
          "Noodle House",
          "Curry Corner",
          "Sushi Express",
        ][i % 5],
        restaurantAddress: `${i * 100 + 100} Main St, Colombo`,
        restaurantLocation,
        customerName: ["Alex", "Sam", "Jordan", "Casey", "Taylor"][i % 5],
        customerAddress: `${i * 100 + 200} Park Ave, Colombo`,
        customerLocation,
        customerPhone: `077-${1000000 + i}`,
        items: [
          {
            name: ["Burger", "Pizza", "Noodles", "Curry", "Sushi"][i % 5],
            quantity: 1 + (i % 3),
          },
          {
            name: [
              "Fries",
              "Garlic Bread",
              "Spring Rolls",
              "Rice",
              "Miso Soup",
            ][i % 5],
            quantity: 1,
          },
        ],
        status: status as OrderStatus,
        distance,
        estimatedTime: `${Math.ceil(distance * 5) + 10} min`,
        earnings,
        createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(), // Past orders from previous days
      };
    });

    setOrderHistory(mockOrderHistory);

    // Mock earnings data
    const totalEarnings = mockOrderHistory
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + order.earnings, 0);

    const earningDetails: EarningDetail[] = mockOrderHistory
      .filter((order) => order.status === "delivered")
      .map((order) => ({
        id: `earning-${order.id}`,
        orderId: order.id,
        restaurantName: order.restaurantName,
        amount: order.earnings,
        date: order.createdAt,
      }));

    setEarnings({
      today: Math.round(totalEarnings * 0.15),
      thisWeek: Math.round(totalEarnings * 0.6),
      thisMonth: totalEarnings,
      allTime: Math.round(totalEarnings * 1.2), // Just a bit more for "all time"
      earnings: earningDetails,
    });
  }, [status]);

  // Connect to WebSocket when driver is active
  useEffect(() => {
    if (status === "offline") {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to WebSocket server for real-time updates
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") || "mock-token" },
    });

    setSocket(newSocket);

    // Handle connection events
    newSocket.on("connect", () => {
      console.log("Socket.IO connected successfully for delivery tracking");

      // Join driver's room (in real app, this would use the driver's ID)
      // Using optional chaining with fallback - adjust the property name based on your User type
      const driverId = user?._id || user?.email || "driver1";
      newSocket.emit("join_driver_room", driverId);

      // Join delivery tracking room if there's a current order
      if (currentOrder) {
        newSocket.emit("track_delivery", currentOrder.id);
      }
    });

    // Handle new delivery assignments
    newSocket.on("new_delivery_assignment", (data) => {
      console.log("Received new delivery assignment:", data);
      toast({
        title: "New Delivery Assignment",
        description: `You have a new order from ${data.restaurantName}`,
      });

      // In the real app, we'd fetch the full order details here
      refreshOrders();
    });

    // Handle errors
    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Error connecting to the delivery system",
        variant: "destructive",
      });
    });

    return () => {
      if (newSocket.connected) {
        if (currentOrder) {
          newSocket.emit("stop_tracking", currentOrder.id);
        }
        newSocket.disconnect();
      }
    };
  }, [status, currentOrder?.id]);

  // Start location tracking
  const startLocationTracking = () => {
    // Clear any existing interval
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
    }

    // For demo, we'll simulate location updates
    // In a real app, we'd use the Geolocation API
    locationIntervalRef.current = setInterval(() => {
      if (!currentLocation) return;

      // If there's a current order, simulate movement toward the destination
      if (currentOrder && socket) {
        // Determine destination based on order status
        const destination =
          currentOrder.status === "assigned" ||
          currentOrder.status === "pending"
            ? currentOrder.restaurantLocation
            : currentOrder.customerLocation;

        // Calculate direction vector
        const lat = currentLocation.lat;
        const lng = currentLocation.lng;

        const latDiff = destination.lat - lat;
        const lngDiff = destination.lng - lng;

        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

        if (distance < 0.0005) {
          // Very close to destination, update order status
          if (
            currentOrder.status === "assigned" ||
            currentOrder.status === "pending"
          ) {
            updateOrderStatus(currentOrder.id, "picked_up");
          } else if (
            currentOrder.status === "picked_up" ||
            currentOrder.status === "in_transit"
          ) {
            updateOrderStatus(currentOrder.id, "delivered");
          }
        } else {
          // Move toward destination
          const speed = 0.0005; // Adjust this for faster/slower movement
          const ratio = speed / distance;

          const newLat = lat + latDiff * ratio;
          const newLng = lng + lngDiff * ratio;

          // Update location
          const newLocation = { lat: newLat, lng: newLng };
          setCurrentLocation(newLocation);

          // Send location update to server via Socket.IO
          socket.emit("location_update", {
            latitude: newLocation.lat,
            longitude: newLocation.lng,
            deliveryId: currentOrder.id,
          });
        }
      } else {
        // If no current order, just add small random movement
        const newLocation = {
          lat: currentLocation.lat + (Math.random() - 0.5) * 0.0005,
          lng: currentLocation.lng + (Math.random() - 0.5) * 0.0005,
        };
        setCurrentLocation(newLocation);
      }
    }, 2000);

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  // Accept an order
  const acceptOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      // Find the order in available orders
      const order = availableOrders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update order status to assigned
      const updatedOrder = { ...order, status: "assigned" as OrderStatus };

      // Update state
      setCurrentOrder(updatedOrder);
      setStatus("busy");
      setAvailableOrders(availableOrders.filter((o) => o.id !== orderId));

      // Simulate socket.io connection in a real app
      if (socket) {
        socket.emit("track_delivery", orderId);
      }

      // Start location tracking
      startLocationTracking();

      // Navigate to order page
      router.push(`/delivery/orders/${orderId}`);
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({
        title: "Error",
        description: "Could not accept the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsLoading(true);
    try {
      if (!currentOrder || currentOrder.id !== orderId) {
        throw new Error("No active order found");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedOrder = { ...currentOrder, status: newStatus };

      // Send update via socket.io
      if (socket) {
        socket.emit("delivery_status_update", {
          deliveryId: orderId,
          status: newStatus,
          notes: `Status updated to ${newStatus} by driver`,
        });
      }

      // Update state
      setCurrentOrder(updatedOrder);

      // For delivered orders, auto-complete after a short delay
      if (newStatus === "delivered") {
        setTimeout(() => {
          completeOrder(orderId);
        }, 3000);
      }

      toast({
        description: `Order status updated to ${newStatus.replace(/_/g, " ")}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Could not update the order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Complete an order - moves it to history
  const completeOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      if (!currentOrder || currentOrder.id !== orderId) {
        throw new Error("No active order found");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const completedOrder = {
        ...currentOrder,
        status: "delivered" as OrderStatus,
      };

      // Update state
      setOrderHistory([completedOrder, ...orderHistory]);

      // Update earnings
      const newEarnings = {
        ...earnings,
        today: earnings.today + completedOrder.earnings,
        thisWeek: earnings.thisWeek + completedOrder.earnings,
        thisMonth: earnings.thisMonth + completedOrder.earnings,
        allTime: earnings.allTime + completedOrder.earnings,
        earnings: [
          {
            id: `earning-${completedOrder.id}`,
            orderId: completedOrder.id,
            restaurantName: completedOrder.restaurantName,
            amount: completedOrder.earnings,
            date: new Date().toISOString(),
          },
          ...earnings.earnings,
        ],
      };

      setEarnings(newEarnings);

      // Reset current order
      setCurrentOrder(null);

      // Change status back to available
      setStatus("available");

      toast({
        title: "Order Completed",
        description: `Delivery completed successfully. You earned Rs. ${completedOrder.earnings.toFixed(
          2
        )}`,
      });

      // Navigate back to dashboard
      router.push("/delivery/dashboard");
    } catch (error) {
      console.error("Error completing order:", error);
      toast({
        title: "Error",
        description: "Could not complete the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string, reason: string) => {
    setIsLoading(true);
    try {
      if (!currentOrder || currentOrder.id !== orderId) {
        throw new Error("No active order found");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const cancelledOrder = {
        ...currentOrder,
        status: "cancelled" as OrderStatus,
      };

      // Send update via socket.io
      if (socket) {
        socket.emit("delivery_status_update", {
          deliveryId: orderId,
          status: "cancelled",
          notes: reason,
        });
      }

      // Update state
      setOrderHistory([cancelledOrder, ...orderHistory]);
      setCurrentOrder(null);

      // Change status back to available
      setStatus("available");

      toast({
        title: "Order Cancelled",
        description: `Order has been cancelled. Reason: ${reason}`,
        variant: "destructive",
      });

      // Navigate back to dashboard
      router.push("/delivery/dashboard");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Could not cancel the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh available orders
  const refreshOrders = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, we would fetch orders from the server
      // For demo, we just regenerate mock orders

      if (!currentLocation) return;

      const mockOrders: Order[] = Array.from(
        { length: Math.floor(Math.random() * 3) + 3 },
        (_, i) => {
          const restaurantLocation = getRandomNearbyCoords(
            currentLocation.lat,
            currentLocation.lng,
            8
          );
          const customerLocation = getRandomNearbyCoords(
            restaurantLocation.lat,
            restaurantLocation.lng,
            5
          );

          const distance = calculateDistance(
            restaurantLocation.lat,
            restaurantLocation.lng,
            customerLocation.lat,
            customerLocation.lng
          );

          // Calculate earnings based on distance
          const earnings = 200 + distance * 100; // Base fee + per km fee

          return {
            id: `order-${Date.now()}-${i}`,
            restaurantId: `rest-${i}`,
            restaurantName: [
              "Burger Palace",
              "Pizza Planet",
              "Noodle House",
              "Curry Corner",
              "Sushi Express",
            ][i % 5],
            restaurantAddress: `${i * 100 + 100} Main St, Colombo`,
            restaurantLocation,
            customerName: ["Alex", "Sam", "Jordan", "Casey", "Taylor"][i % 5],
            customerAddress: `${i * 100 + 200} Park Ave, Colombo`,
            customerLocation,
            customerPhone: `077-${1000000 + i}`,
            items: [
              {
                name: ["Burger", "Pizza", "Noodles", "Curry", "Sushi"][i % 5],
                quantity: 1 + (i % 3),
              },
              {
                name: [
                  "Fries",
                  "Garlic Bread",
                  "Spring Rolls",
                  "Rice",
                  "Miso Soup",
                ][i % 5],
                quantity: 1,
              },
            ],
            status: "pending" as OrderStatus,
            distance,
            estimatedTime: `${Math.ceil(distance * 5) + 10} min`,
            earnings,
            createdAt: new Date(Date.now() - i * 60000).toISOString(), // Orders staggered by 1 minute
          };
        }
      );

      setAvailableOrders(mockOrders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast({
        title: "Error",
        description: "Could not refresh orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{
        status,
        setStatus,
        currentLocation,
        availableOrders,
        currentOrder,
        orderHistory,
        earnings,
        isLoading,
        acceptOrder,
        updateOrderStatus,
        completeOrder,
        cancelOrder,
        startLocationTracking,
        stopLocationTracking,
        refreshOrders,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

// Custom hook to use delivery context
export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider");
  }
  return context;
}
