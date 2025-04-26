"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"

// Define delivery status types
export type DeliveryStatus = "available" | "busy" | "offline"
export type OrderStatus = "ready_for_pickup" | "picked_up" | "on_the_way" | "delivered" | "cancelled"

// Define order interface
export interface DeliveryOrder {
  id: string
  restaurantId: string
  restaurantName: string
  restaurantAddress: string
  restaurantLocation: {
    lat: number
    lng: number
  }
  customerName: string
  customerAddress: string
  customerLocation: {
    lat: number
    lng: number
  }
  customerPhone: string
  items: {
    name: string
    quantity: number
  }[]
  total: number
  status: OrderStatus
  distance: number
  estimatedTime: string
  earnings: number
  createdAt: string
}

// Define delivery context interface
interface DeliveryContextType {
  status: DeliveryStatus
  setStatus: (status: DeliveryStatus) => void
  currentLocation: { lat: number; lng: number } | null
  updateLocation: (location: { lat: number; lng: number }) => void
  availableOrders: DeliveryOrder[]
  currentOrder: DeliveryOrder | null
  acceptOrder: (orderId: string) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>
  completeOrder: (orderId: string) => Promise<void>
  cancelOrder: (orderId: string, reason: string) => Promise<void>
  orderHistory: DeliveryOrder[]
  earnings: {
    today: number
    week: number
    month: number
  }
  isLoading: boolean
}

// Create the delivery context
const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined)

// Mock data for available orders
const mockAvailableOrders: DeliveryOrder[] = [
  {
    id: "ORD-1001",
    restaurantId: "1",
    restaurantName: "Burger Palace",
    restaurantAddress: "123 Burger St, New York, NY 10001",
    restaurantLocation: { lat: 40.7128, lng: -74.006 },
    customerName: "John Doe",
    customerAddress: "456 Customer Ave, New York, NY 10002",
    customerLocation: { lat: 40.7148, lng: -74.01 },
    customerPhone: "+1 (555) 123-4567",
    items: [
      { name: "Classic Cheeseburger", quantity: 2 },
      { name: "French Fries", quantity: 1 },
    ],
    total: 24.97,
    status: "ready_for_pickup",
    distance: 2.3,
    estimatedTime: "15-20 min",
    earnings: 8.5,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-1002",
    restaurantId: "2",
    restaurantName: "Pizza Heaven",
    restaurantAddress: "789 Pizza Rd, New York, NY 10003",
    restaurantLocation: { lat: 40.722, lng: -73.998 },
    customerName: "Jane Smith",
    customerAddress: "101 Customer Blvd, New York, NY 10004",
    customerLocation: { lat: 40.728, lng: -73.99 },
    customerPhone: "+1 (555) 987-6543",
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Garlic Bread", quantity: 1 },
    ],
    total: 19.98,
    status: "ready_for_pickup",
    distance: 1.8,
    estimatedTime: "10-15 min",
    earnings: 7.25,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-1003",
    restaurantId: "3",
    restaurantName: "Sushi Express",
    restaurantAddress: "456 Sushi St, New York, NY 10005",
    restaurantLocation: { lat: 40.718, lng: -73.99 },
    customerName: "Mike Johnson",
    customerAddress: "202 Customer St, New York, NY 10006",
    customerLocation: { lat: 40.712, lng: -73.982 },
    customerPhone: "+1 (555) 456-7890",
    items: [
      { name: "California Roll", quantity: 2 },
      { name: "Miso Soup", quantity: 1 },
    ],
    total: 22.97,
    status: "ready_for_pickup",
    distance: 3.1,
    estimatedTime: "20-25 min",
    earnings: 9.75,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
]

// Mock data for order history
const mockOrderHistory: DeliveryOrder[] = [
  {
    id: "ORD-1000",
    restaurantId: "1",
    restaurantName: "Burger Palace",
    restaurantAddress: "123 Burger St, New York, NY 10001",
    restaurantLocation: { lat: 40.7128, lng: -74.006 },
    customerName: "Sarah Williams",
    customerAddress: "303 Customer Pl, New York, NY 10007",
    customerLocation: { lat: 40.723, lng: -74.002 },
    customerPhone: "+1 (555) 234-5678",
    items: [
      { name: "Veggie Burger", quantity: 1 },
      { name: "Onion Rings", quantity: 1 },
    ],
    total: 18.98,
    status: "delivered",
    distance: 2.5,
    estimatedTime: "15-20 min",
    earnings: 8.25,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-999",
    restaurantId: "2",
    restaurantName: "Pizza Heaven",
    restaurantAddress: "789 Pizza Rd, New York, NY 10003",
    restaurantLocation: { lat: 40.722, lng: -73.998 },
    customerName: "David Brown",
    customerAddress: "404 Customer Cir, New York, NY 10008",
    customerLocation: { lat: 40.715, lng: -73.995 },
    customerPhone: "+1 (555) 876-5432",
    items: [
      { name: "Pepperoni Pizza", quantity: 1 },
      { name: "Soda", quantity: 2 },
    ],
    total: 21.97,
    status: "delivered",
    distance: 1.9,
    estimatedTime: "10-15 min",
    earnings: 7.5,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
]

// Delivery provider component
export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<DeliveryStatus>("offline")
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([])
  const [currentOrder, setCurrentOrder] = useState<DeliveryOrder | null>(null)
  const [orderHistory, setOrderHistory] = useState<DeliveryOrder[]>(mockOrderHistory)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [earnings, setEarnings] = useState({
    today: 35.75,
    week: 245.5,
    month: 980.25,
  })

  // Initialize location and load available orders when status changes
  useEffect(() => {
    if (status === "available") {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.error("Error getting location:", error)
            // Default to New York City coordinates
            setCurrentLocation({ lat: 40.7128, lng: -74.006 })
          },
        )
      }

      // Load available orders
      setAvailableOrders(mockAvailableOrders)
    } else if (status === "offline") {
      setAvailableOrders([])
    }
  }, [status])

  // Update location
  const updateLocation = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location)

    // In a real app, this would call the Location Service microservice
    // to update the driver's location in the backend
    console.log("Location updated:", location)
  }

  // Accept an order
  const acceptOrder = async (orderId: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the Order Service and Delivery Service microservices
      // to update the order status and assign it to the current driver

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find the order in available orders
      const order = availableOrders.find((o) => o.id === orderId)
      if (!order) {
        throw new Error("Order not found")
      }

      // Update order status
      const updatedOrder = { ...order, status: "picked_up" as OrderStatus }
      setCurrentOrder(updatedOrder)
      setStatus("busy")

      // Remove from available orders
      setAvailableOrders(availableOrders.filter((o) => o.id !== orderId))

      toast({
        title: "Order accepted",
        description: `You've accepted order #${orderId}`,
      })

      // Navigate to the order detail page
      router.push(`/delivery/orders/${orderId}`)
    } catch (error) {
      console.error("Error accepting order:", error)
      toast({
        title: "Failed to accept order",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the Order Service and Delivery Service microservices
      // to update the order status

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update current order status
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({ ...currentOrder, status })
      }

      toast({
        title: "Order status updated",
        description: `Order #${orderId} is now ${status.replace("_", " ")}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Failed to update order status",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Complete an order
  const completeOrder = async (orderId: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the Order Service, Delivery Service, and Payment Service microservices
      // to mark the order as delivered and update earnings

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (currentOrder && currentOrder.id === orderId) {
        // Add to order history
        const completedOrder = { ...currentOrder, status: "delivered" as OrderStatus }
        setOrderHistory([completedOrder, ...orderHistory])

        // Update earnings
        setEarnings({
          ...earnings,
          today: earnings.today + completedOrder.earnings,
          week: earnings.week + completedOrder.earnings,
          month: earnings.month + completedOrder.earnings,
        })

        // Clear current order
        setCurrentOrder(null)
        setStatus("available")

        toast({
          title: "Order completed",
          description: `You've earned $${completedOrder.earnings.toFixed(2)} for this delivery`,
        })

        // Navigate back to dashboard
        router.push("/delivery/dashboard")
      }
    } catch (error) {
      console.error("Error completing order:", error)
      toast({
        title: "Failed to complete order",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel an order
  const cancelOrder = async (orderId: string, reason: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would call the Order Service and Delivery Service microservices
      // to cancel the order and reassign it to another driver

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (currentOrder && currentOrder.id === orderId) {
        // Clear current order
        setCurrentOrder(null)
        setStatus("available")

        toast({
          title: "Order cancelled",
          description: `Order #${orderId} has been cancelled`,
        })

        // Navigate back to dashboard
        router.push("/delivery/dashboard")
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Failed to cancel order",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DeliveryContext.Provider
      value={{
        status,
        setStatus,
        currentLocation,
        updateLocation,
        availableOrders,
        currentOrder,
        acceptOrder,
        updateOrderStatus,
        completeOrder,
        cancelOrder,
        orderHistory,
        earnings,
        isLoading,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  )
}

// Custom hook to use delivery context
export function useDelivery() {
  const context = useContext(DeliveryContext)
  if (context === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider")
  }
  return context
}
