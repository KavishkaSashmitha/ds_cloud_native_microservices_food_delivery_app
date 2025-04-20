"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface MapComponentProps {
  latitude?: number
  longitude?: number
  height?: string
  zoom?: number
  readOnly?: boolean
  onLocationChange?: (lat: number, lng: number) => void
}

export default function MapComponent({
  latitude = 40.7128,
  longitude = -74.006,
  height = "300px",
  zoom = 13,
  readOnly = false,
  onLocationChange,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Load Leaflet dynamically on the client side
  useEffect(() => {
    // Only run this on the client
    if (typeof window === "undefined") return

    // Load Leaflet CSS
    const linkEl = document.createElement("link")
    linkEl.rel = "stylesheet"
    linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    linkEl.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    linkEl.crossOrigin = ""
    document.head.appendChild(linkEl)

    // Load Leaflet JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    script.crossOrigin = ""
    script.async = true

    script.onload = () => {
      setIsMapLoaded(true)
    }

    document.body.appendChild(script)

    return () => {
      document.head.removeChild(linkEl)
      document.body.removeChild(script)
    }
  }, [])

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return

    const L = (window as any).L

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], zoom)
    mapInstanceRef.current = map

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add marker
    const marker = L.marker([latitude, longitude], {
      draggable: !readOnly,
    }).addTo(map)
    markerRef.current = marker

    // Handle marker drag events if not read-only
    if (!readOnly && onLocationChange) {
      marker.on("dragend", (event: any) => {
        const position = marker.getLatLng()
        onLocationChange(position.lat, position.lng)
      })

      // Handle map click events
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng)
        if (onLocationChange) {
          onLocationChange(e.latlng.lat, e.latlng.lng)
        }
      })
    }

    // Clean up
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [isMapLoaded, latitude, longitude, zoom, readOnly, onLocationChange])

  // Update marker position when coordinates change
  useEffect(() => {
    if (!isMapLoaded || !markerRef.current || !mapInstanceRef.current) return

    const L = (window as any).L
    markerRef.current.setLatLng([latitude, longitude])
    mapInstanceRef.current.setView([latitude, longitude], zoom)
  }, [latitude, longitude, zoom, isMapLoaded])

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg z-0"></div>
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-2"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      {!readOnly && (
        <div className="absolute bottom-2 right-2 bg-white p-2 rounded-md shadow-md text-xs text-gray-600 z-10">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{readOnly ? "Restaurant location" : "Click on map or drag marker to set location"}</span>
          </div>
        </div>
      )}
    </div>
  )
}
