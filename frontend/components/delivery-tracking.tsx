"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Navigation, Clock, MapPin, Info } from "lucide-react";
import DeliveryMap from "@/components/delivery-map";
import { io, Socket } from "socket.io-client";

// Status labels for UI display
const statusLabels = {
  pending: "Pending",
  assigned: "Driver Assigned",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

// Status colors for UI display
const statusColors = {
  pending: "bg-gray-500",
  assigned: "bg-blue-500",
  picked_up: "bg-yellow-500",
  in_transit: "bg-orange-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

interface DeliveryTrackingProps {
  deliveryId: string;
  orderId: string;
  initialStatus?: string;
  driverLocation?: { lat: number; lng: number } | null;
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    rating: number;
    location?: {
      lat: number;
      lng: number;
    };
  };
  estimatedDeliveryTime?: Date;
}

interface DeliveryInfo {
  _id: string;
  status: string;
  deliveryPersonnelId: string;
  restaurantName: string;
  restaurantLocation: {
    coordinates: number[];
  };
  restaurantAddress: string;
  customerLocation: {
    coordinates: number[];
  };
  customerAddress: string;
  deliveryPersonnel?: {
    name: string;
    phone: string;
    vehicleType: string;
    rating: number;
  };
  estimatedDeliveryTime: number;
  assignedAt: string;
}

interface LocationUpdate {
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}

export default function DeliveryTracking({
  deliveryId,
  orderId,
  initialStatus = "pending",
  driverLocation,
  driver,
  estimatedDeliveryTime,
}: DeliveryTrackingProps) {
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<DeliveryInfo | null>(null);
  const [currentDriverLocation, setCurrentDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(driverLocation || null);
  const [estimatedArrival, setEstimatedArrival] = useState<string | null>(
    estimatedDeliveryTime
      ? new Date(estimatedDeliveryTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null
  );
  const [status, setStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (driverLocation) {
      setCurrentDriverLocation(driverLocation);
    }
  }, [driverLocation]);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        if (driver && driverLocation) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/deliveries/${deliveryId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch delivery details");
        }

        const data = await res.json();
        setDelivery(data.delivery);
        setStatus(data.delivery.status);

        if (data.delivery.deliveryPersonnelId && !driverLocation) {
          fetchDriverLocation(data.delivery.deliveryPersonnelId);
        }
      } catch (error) {
        console.error("Error fetching delivery:", error);
        toast({
          title: "Error",
          description: "Failed to load delivery information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [deliveryId, toast, driver, driverLocation]);

  const fetchDriverLocation = async (driverId: string) => {
    try {
      const res = await fetch(`/api/location/personnel/${driverId}`);

      if (!res.ok) return;

      const data = await res.json();
      if (data.location) {
        setCurrentDriverLocation({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });

        if (!estimatedDeliveryTime) {
          calculateETA(data.location.latitude, data.location.longitude);
        }
      }
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

  const calculateETA = (driverLat: number, driverLng: number) => {
    if (!delivery) return;

    const destCoords =
      status === "picked_up" || status === "in_transit"
        ? delivery.customerLocation.coordinates
        : delivery.restaurantLocation.coordinates;

    const R = 6371;
    const dLat = ((destCoords[1] - driverLat) * Math.PI) / 180;
    const dLng = ((destCoords[0] - driverLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((driverLat * Math.PI) / 180) *
        Math.cos((destCoords[1] * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const timeInMinutes = Math.ceil(distance * 3);

    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + timeInMinutes);

    const formattedTime = arrivalTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setEstimatedArrival(formattedTime);
  };

  useEffect(() => {
    if (driverLocation !== undefined) {
      return;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    console.log("Connecting to socket server at:", socketUrl);

    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket.IO connected successfully");

      socket.emit("track_delivery", deliveryId);
      console.log(`Tracking delivery: ${deliveryId}`);
    });

    socket.on("delivery_status_update", (data) => {
      console.log("Received delivery status update:", data);
      if (data.deliveryId === deliveryId || data.orderId === orderId) {
        setStatus(data.status);
        toast({
          title: "Delivery Status Updated",
          description: `Your delivery is now ${
            statusLabels[data.status as keyof typeof statusLabels] ||
            data.status
          }`,
        });
      }
    });

    socket.on("location_update", (data) => {
      console.log("Received location update:", data);
      if (data.deliveryId === deliveryId) {
        setCurrentDriverLocation({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });

        if (data.estimatedArrival) {
          const arrivalTime = new Date(
            data.estimatedArrival.estimatedArrivalTime
          );
          setEstimatedArrival(
            arrivalTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        } else {
          calculateETA(data.location.latitude, data.location.longitude);
        }
      }
    });

    socket.on("delivery_tracking_update", (data) => {
      console.log("Received delivery tracking update:", data);
      if (data.deliveryId === deliveryId || data.orderId === orderId) {
        setCurrentDriverLocation({
          lat: data.location.latitude,
          lng: data.location.longitude,
        });

        if (data.status) {
          setStatus(data.status);
        }

        if (data.estimatedArrival) {
          const arrivalTime = new Date(data.estimatedArrival);
          setEstimatedArrival(
            arrivalTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      console.log("Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.emit("stop_tracking", deliveryId);
        socketRef.current.disconnect();
      }
    };
  }, [deliveryId, orderId, toast, driverLocation]);

  const formatPhone = (phone: string) => {
    if (/^\d{10}$/.test(phone)) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const renderDriverInfo = () => {
    const driverInfo = driver || delivery?.deliveryPersonnel;

    if (!driverInfo) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-center text-gray-600">
            Driver information will appear here once assigned.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-800">
            {driverInfo.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{driverInfo.name}</h3>
            <div className="text-sm text-gray-600">
              {driverInfo.vehicleType.charAt(0).toUpperCase() +
                driverInfo.vehicleType.slice(1)}
            </div>
            <div className="flex items-center text-sm">
              <span className="text-yellow-500">★</span>
              <span>{driverInfo.rating.toFixed(1)}</span>
            </div>
          </div>
          <a
            href={`tel:${driverInfo.phone}`}
            className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200"
          >
            <Phone className="h-5 w-5" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Delivery Tracking</CardTitle>
            <Badge
              className={`${
                statusColors[status as keyof typeof statusColors] ||
                "bg-gray-500"
              } text-white`}
            >
              {statusLabels[status as keyof typeof statusLabels] || status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[300px] lg:h-[400px] w-full overflow-hidden rounded-lg border shadow-sm">
            <DeliveryMap
                          driver={currentDriverLocation}
                          restaurant={
                            delivery?.restaurantLocation?.coordinates
                              ? {
                                  lat: delivery.restaurantLocation.coordinates[1],
                                  lng: delivery.restaurantLocation.coordinates[0],
                                }
                              : undefined
                          }
                          customer={
                            delivery?.customerLocation?.coordinates
                              ? {
                                  lat: delivery.customerLocation.coordinates[1],
                                  lng: delivery.customerLocation.coordinates[0],
                                }
                              : undefined
                          }
                          status={status}
                        />
          </div>

          {renderDriverInfo()}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Clock className="text-orange-500 h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Estimated Arrival</p>
                <p className="text-xl font-bold">
                  {estimatedArrival || "Calculating..."}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="text-orange-500 h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Pickup</p>
                <p className="text-sm line-clamp-1">
                  {delivery?.restaurantName || "Restaurant"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Navigation className="text-orange-500 h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-sm line-clamp-1">
                  {delivery?.customerAddress || "Your address"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start space-x-3">
            <Info className="text-blue-500 h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800">Tracking Updates</h4>
              <p className="text-blue-600 text-sm">
                Real-time location updates may be delayed by 15-30 seconds based
                on GPS accuracy.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Order
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="ml-auto"
            >
              Refresh Tracking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
