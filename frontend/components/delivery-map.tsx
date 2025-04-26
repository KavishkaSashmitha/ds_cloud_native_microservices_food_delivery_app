"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation } from "lucide-react"

import type { DeliveryOrder } from "@/contexts/delivery-context"

interface DeliveryMapProps {
  currentLocation: { lat: number; lng: number } | null
  orders: DeliveryOrder[]
  currentOrder?: DeliveryOrder | null
  height?: number
  onMarkerClick?: (orderId: string) => void
  showDirections?: boolean
}

// This is a placeholder component that simulates a map
// In a real application, you would use a library like Google Maps, Mapbox, or Leaflet
export default function DeliveryMap({
  currentLocation,
  orders,
  currentOrder,
  height = 400,
  onMarkerClick,
  showDirections = false,
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // In a real app, this would initialize the map library
  useEffect(() => {
    if (!isMapLoaded || !currentLocation) return

    // Here you would initialize your map with the current location
    console.log("Map initialized with location:", currentLocation)

    // And add markers for each order
    orders.forEach((order) => {
      console.log("Adding marker for order:", order.id)
    })

    // If there's a current order and showDirections is true, show directions
    if (currentOrder && showDirections) {
      console.log("Showing directions to:", currentOrder.restaurantName)
    }
  }, [isMapLoaded, currentLocation, orders, currentOrder, showDirections])

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center rounded-lg border bg-gray-50" style={{ height: `${height}px` }}>
        <div className="text-center">
          <Navigation className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p>Location data not available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className="relative overflow-hidden rounded-lg border bg-gray-100"
      style={{ height: `${height}px` }}
    >
      {!isMapLoaded ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] bg-cover bg-center opacity-50"></div>

          {/* Current location marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="relative">
              <div className="absolute -left-3 -top-3 h-6 w-6 animate-ping rounded-full bg-blue-400 opacity-75"></div>
              <div className="relative h-6 w-6 rounded-full bg-blue-500 text-white">
                <Navigation className="h-6 w-6 p-1" />
              </div>
            </div>
          </div>

          {/* Order markers */}
          {orders.map((order, index) => {
            // Calculate position based on order location relative to current location
            // This is just a simulation - in a real map, you would use actual coordinates
            const angle = (index * Math.PI * 2) / orders.length
            const distance = order.distance * 10 // Scale for visualization
            const maxDistance = Math.min(mapRef.current?.clientWidth || 300, mapRef.current?.clientHeight || 300) / 3
            const scaledDistance = Math.min(distance, maxDistance)
            const x = Math.cos(angle) * scaledDistance
            const y = Math.sin(angle) * scaledDistance

            const isCurrentOrder = currentOrder?.id === order.id

            return (
              <div
                key={order.id}
                className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full ${
                  isCurrentOrder ? "bg-orange-500" : "bg-red-500"
                } text-white transition-all hover:z-10 hover:scale-110`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
                onClick={() => onMarkerClick?.(order.id)}
              >
                <MapPin className="h-5 w-5" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-800 shadow-md">
                  {order.restaurantName}
                </div>
              </div>
            )
          })}

          {/* Direction line (if showing directions) */}
          {currentOrder && showDirections && (
            <div
              className="absolute left-1/2 top-1/2 h-0.5 w-40 -translate-x-1/2 -translate-y-1/2 transform bg-blue-500"
              style={{
                transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          )}

          {/* Map controls (simulated) */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">+</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">-</button>
          </div>

          {/* Map attribution */}
          <div className="absolute bottom-2 left-2 text-xs text-gray-600">Map data © FoodExpress</div>
        </>
      )}
    </div>
  )
}
