"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, Navigation, Package, ExternalLink } from "lucide-react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Define types
type Coordinates = {
  lat: number;
  lng: number;
};

type Delivery = {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerAddress: string;
  items: string;
  distance: string;
  estimatedTime: string;
  paymentAmount: string;
  coordinates: Coordinates;
};

type DirectionsResult = google.maps.DirectionsResult;

// Sample data for available deliveries
const availableDeliveries: Delivery[] = [
  {
    id: "order-1",
    restaurantName: "Pizza Hut",
    restaurantAddress: "123 Main St, Colombo 03",
    customerAddress: "456 Park Ave, Colombo 05",
    items: "1x Large Pepperoni Pizza, 2x Garlic Bread",
    distance: "2.3 km",
    estimatedTime: "15-20 min",
    paymentAmount: "Rs. 850",
    coordinates: { lat: 6.9271, lng: 79.8612 },
  },
  {
    id: "order-2",
    restaurantName: "McDonald's",
    restaurantAddress: "789 High St, Colombo 04",
    customerAddress: "101 Lake Side, Colombo 08",
    items: "2x Big Mac, 1x Large Fries, 1x Coke",
    distance: "3.5 km",
    estimatedTime: "20-25 min",
    paymentAmount: "Rs. 1200",
    coordinates: { lat: 6.9101, lng: 79.8528 },
  },
  // ... add more deliveries as needed
];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center: Coordinates = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function AvailableDeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [directions, setDirections] = useState<DirectionsResult | null>(null);
  const { toast } = useToast();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "drawing", "geometry", "visualization"] as (
      | "places"
      | "drawing"
      | "geometry"
      | "visualization"
    )[],
  });

  // Get user's current location
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
          console.error("Error getting current location:", error);
          // Fallback location if user denies permission
          setCurrentLocation({ lat: 6.9165, lng: 79.8473 }); // Default location in Colombo
          toast({
            title: "Location Error",
            description:
              "Using default location. Please enable location services for better accuracy.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  // Get directions when a delivery is selected
  useEffect(() => {
    if (selectedDelivery && currentLocation && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: currentLocation,
          destination: selectedDelivery.coordinates,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed: ${status}`);
            toast({
              title: "Route Error",
              description: "Could not calculate route to this location",
              variant: "destructive",
            });
          }
        }
      );
    }
  }, [selectedDelivery, currentLocation, toast]);

  const handleAcceptDelivery = (deliveryId: string) => {
    toast({
      title: "Delivery Accepted",
      description: `You have accepted order from ${
        availableDeliveries.find((d) => d.id === deliveryId)?.restaurantName
      }.`,
    });
  };

  const openInGoogleMaps = (destination: Coordinates) => {
    if (!currentLocation) return;

    // Format for Google Maps directions URL
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

    // Open in a new tab
    window.open(url, "_blank");
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Available Deliveries</h1>
          <p className="text-gray-500">Choose a delivery to accept</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Map Section */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Map</CardTitle>
            </CardHeader>
            <CardContent>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={13}
                center={currentLocation || center}
              >
                {/* Current location marker */}
                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                  />
                )}

                {/* Restaurant markers */}
                {availableDeliveries.map((delivery) => (
                  <Marker
                    key={delivery.id}
                    position={delivery.coordinates}
                    onClick={() => setSelectedDelivery(delivery)}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                  />
                ))}

                {/* Direction route */}
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{ suppressMarkers: true }}
                  />
                )}

                {/* Info window for selected delivery */}
                {selectedDelivery && (
                  <InfoWindow
                    position={selectedDelivery.coordinates}
                    onCloseClick={() => {
                      setSelectedDelivery(null);
                      setDirections(null);
                    }}
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold">
                        {selectedDelivery.restaurantName}
                      </h3>
                      <p className="text-sm">
                        {selectedDelivery.distance} away
                      </p>
                      <p className="text-sm">
                        Earn: {selectedDelivery.paymentAmount}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAcceptDelivery(selectedDelivery.id)
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openInGoogleMaps(selectedDelivery.coordinates)
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </CardContent>
          </Card>

          {/* Delivery List Section */}
          <Card>
            <CardHeader>
              <CardTitle>Nearby Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedDelivery?.id === delivery.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{delivery.restaurantName}</h3>
                    <span className="font-bold text-green-600">
                      {delivery.paymentAmount}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{delivery.distance} away</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{delivery.estimatedTime}</span>
                  </div>
                  <div className="flex items-start mt-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2 mt-0.5" />
                    <span>{delivery.items}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptDelivery(delivery.id);
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInGoogleMaps(delivery.coordinates);
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
