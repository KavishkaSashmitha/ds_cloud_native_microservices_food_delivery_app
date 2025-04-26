"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle, Clock, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Steps, Step } from "@/components/steps"

// Mock order data
const mockOrder = {
  id: "ORD12345",
  status: "preparing", // pending, preparing, ready, out_for_delivery, delivered, cancelled
  date: new Date().toISOString(),
  restaurant: {
    id: "1",
    name: "Burger Palace",
    image: "/placeholder.svg?height=60&width=60",
    phone: "+1 (555) 123-4567",
  },
  items: [
    {
      id: "101",
      name: "Classic Cheeseburger",
      quantity: 2,
      price: 8.99,
      options: [
        { name: "Size", value: "Regular" },
        { name: "Add-on", value: "Bacon" },
      ],
    },
    {
      id: "104",
      name: "French Fries",
      quantity: 1,
      price: 3.99,
      options: [{ name: "Size", value: "Large" }],
    },
    {
      id: "106",
      name: "Chocolate Milkshake",
      quantity: 2,
      price: 4.99,
    },
  ],
  delivery: {
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    estimatedTime: "30-40 min",
    deliveryPerson: {
      name: "Michael Johnson",
      phone: "+1 (555) 987-6543",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  payment: {
    method: "Credit Card",
    subtotal: 31.95,
    deliveryFee: 3.99,
    tax: 2.56,
    total: 38.5,
  },
}

export default function OrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const [order, setOrder] = useState(mockOrder)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    // Check if this is a new order with success status
    if (searchParams.get("status") === "success") {
      setShowSuccessMessage(true)

      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)

      return () => clearTimeout(timer)
    }

    // In a real app, fetch order details from API
    // For now, just use mock data with the ID from the URL
    setOrder({
      ...mockOrder,
      id: orderId.toUpperCase(),
    })
  }, [orderId, searchParams])

  // Get current step based on order status
  const getCurrentStep = () => {
    switch (order.status) {
      case "pending":
        return 0
      case "preparing":
        return 1
      case "ready":
        return 2
      case "out_for_delivery":
        return 3
      case "delivered":
        return 4
      case "cancelled":
        return -1
      default:
        return 0
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/customer/orders" className="mb-4 flex items-center text-gray-600 hover:text-orange-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
            {order.status.replace("_", " ").charAt(0).toUpperCase() + order.status.replace("_", " ").slice(1)}
          </span>
        </div>
        <p className="text-gray-600">{formatDate(order.date)}</p>
      </div>

      {showSuccessMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <p>Your order has been placed successfully! The restaurant will confirm it shortly.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              {order.status === "cancelled" ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-red-700">
                  <p className="font-medium">This order has been cancelled</p>
                </div>
              ) : (
                <Steps currentStep={getCurrentStep()}>
                  <Step title="Order Placed" description="Restaurant received your order" />
                  <Step title="Preparing" description="Restaurant is preparing your food" />
                  <Step title="Ready for Pickup" description="Your order is ready for pickup" />
                  <Step title="Out for Delivery" description="Driver is on the way" />
                  <Step title="Delivered" description="Enjoy your meal!" />
                </Steps>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>Estimated delivery time: {order.delivery.estimatedTime}</span>
                </div>
                <Button variant="outline">Track Order</Button>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={order.restaurant.image || "/placeholder.svg"}
                    alt={order.restaurant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{order.restaurant.name}</h3>
                  <div className="mt-2 flex items-center gap-4">
                    <Button variant="outline" size="sm" className="h-8">
                      View Menu
                    </Button>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{order.restaurant.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-600">{order.delivery.address}</p>
                </div>
              </div>

              {order.status === "out_for_delivery" && order.delivery.deliveryPerson && (
                <div className="mt-4 rounded-lg border p-4">
                  <p className="mb-2 font-medium">Delivery Person</p>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={order.delivery.deliveryPerson.image || "/placeholder.svg"}
                        alt={order.delivery.deliveryPerson.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p>{order.delivery.deliveryPerson.name}</p>
                      <p className="text-sm text-gray-600">{order.delivery.deliveryPerson.phone}</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Call
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Order Summary */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Items ({order.items.length})</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {item.options.map((option, index) => (
                            <span key={index}>
                              {option.name}: {option.value}
                              {index < item.options!.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.payment.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${order.payment.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.payment.tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.payment.total.toFixed(2)}</span>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="font-medium">Payment Method</p>
                <p>{order.payment.method}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
