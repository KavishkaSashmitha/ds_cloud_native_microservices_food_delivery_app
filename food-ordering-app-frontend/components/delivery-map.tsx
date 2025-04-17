"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface Coordinates {
  lat: number
  lng: number
}

interface Delivery {
  id: string
  restaurantName: string
  coordinates: Coordinates
}

interface DeliveryMapProps {
  deliveries: Delivery[]
  selectedDeliveryId: string | null
  onMarkerClick?: (id: string) => void
}

export function DeliveryMap({ deliveries, selectedDeliveryId, onMarkerClick }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [currentLocation, setCurrentLocation] = useState<Coordinates>({ lat: 6.9271, lng: 79.8612 }) // Default to Colombo

  // This is a simplified map implementation
  // In a real application, you would use a mapping library like Google Maps, Mapbox, or Leaflet
  useEffect(() => {
    // Simulate getting user's location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          () => {
            console.log("Unable to retrieve your location")
          },
        )
      } else {
        console.log("Geolocation is not supported by your browser")
      }
    }

    getUserLocation()
  }, [])

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-muted">
      {/* This is a placeholder for a real map */}
      <div className="absolute inset-0 bg-[url('/map-placeholder.png')] bg-cover bg-center opacity-50"></div>

      {/* Current location marker */}
      <div
        className="absolute left-1/2 top-1/2 z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white"
        style={{
          boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.4)",
        }}
      >
        <span className="h-3 w-3 rounded-full bg-white"></span>
      </div>

      {/* Delivery markers */}
      {deliveries.map((delivery) => {
        // Calculate random offsets for demonstration purposes
        const offsetX = (Math.random() - 0.5) * 200
        const offsetY = (Math.random() - 0.5) * 200

        const isSelected = selectedDeliveryId === delivery.id

        return (
          <div
            key={delivery.id}
            className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center transition-all duration-200 ${
              isSelected ? "scale-110" : ""
            }`}
            style={{
              left: `calc(50% + ${offsetX}px)`,
              top: `calc(50% + ${offsetY}px)`,
            }}
            onClick={() => onMarkerClick?.(delivery.id)}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isSelected ? "bg-primary" : "bg-muted-foreground"
              } text-white shadow-lg`}
            >
              <MapPin className="h-5 w-5" />
            </div>
            {isSelected && (
              <div className="mt-1 rounded-md bg-white px-2 py-1 text-xs font-medium shadow-md">
                {delivery.restaurantName}
              </div>
            )}
          </div>
        )
      })}

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-xl font-bold">+</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-xl font-bold">-</span>
        </button>
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">Map data © 2025 | Terms of Use</div>
    </div>
  )
}
