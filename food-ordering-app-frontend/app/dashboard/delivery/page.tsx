"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
    items: "2x Big Mac, 1x Large Fries",
    distance: "3.5 km",
    estimatedTime: "20-25 min",
    paymentAmount: "Rs. 1200",
    coordinates: { lat: 6.9101, lng: 79.8528 },
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "100vh", // Full height for the map
};

export default function DeliveryPage() {
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
    libraries: ["places"] as "places"[],
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
          setCurrentLocation({ lat: 6.9271, lng: 79.8612 }); // Default location
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

  // Get directions when a delivery is accepted
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
    const delivery = availableDeliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      setSelectedDelivery(delivery);
      toast({
        title: "Delivery Accepted",
        description: `You have accepted order from ${delivery.restaurantName}.`,
      });
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <DashboardLayout>
      <div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={currentLocation || { lat: 6.9271, lng: 79.8612 }}
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

          {/* Delivery markers */}
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

          {/* Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: true }}
            />
          )}

          {/* InfoWindow for selected delivery */}
          {selectedDelivery && (
            <InfoWindow
              position={selectedDelivery.coordinates}
              onCloseClick={() => {
                setSelectedDelivery(null);
                setDirections(null);
              }}
            >
              <div>
                <h3 className="font-bold">{selectedDelivery.restaurantName}</h3>
                <p>{selectedDelivery.restaurantAddress}</p>
                <p>{selectedDelivery.items}</p>
                <p className="font-bold">{selectedDelivery.paymentAmount}</p>
                <Button
                  className="mt-2"
                  onClick={() => handleAcceptDelivery(selectedDelivery.id)}
                >
                  Accept Delivery
                </Button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </DashboardLayout>
  );
}
