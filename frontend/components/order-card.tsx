"use client"

import { ChevronDown, ChevronUp, Phone, MapPin } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  items: OrderItem[]
  total: number
  status: string
  time: string
  address: string
  phone: string
}

interface OrderCardProps {
  order: Order
  onUpdateStatus: (orderId: string, newStatus: string) => void
}

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return [
          { value: "pending", label: "Pending" },
          { value: "preparing", label: "Accept & Prepare" },
          { value: "cancelled", label: "Cancel Order" },
        ]
      case "preparing":
        return [
          { value: "preparing", label: "Preparing" },
          { value: "ready", label: "Ready for Pickup" },
          { value: "cancelled", label: "Cancel Order" },
        ]
      case "ready":
        return [
          { value: "ready", label: "Ready for Pickup" },
          { value: "completed", label: "Complete Order" },
        ]
      case "completed":
        return [{ value: "completed", label: "Completed" }]
      case "cancelled":
        return [{ value: "cancelled", label: "Cancelled" }]
      default:
        return []
    }
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{order.id}</span>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{order.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">${order.total.toFixed(2)}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-0 pt-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-medium">{order.customerName}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{order.items.length} items</span>
            </div>
          </div>
          {isExpanded && (
            <div className="mt-4 space-y-4">
              <div className="rounded-md border p-3">
                <h4 className="mb-2 font-medium">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 text-sm font-medium">
                    <div className="flex items-center justify-between">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md border p-3">
                <h4 className="mb-2 font-medium">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{order.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <div className="text-sm text-muted-foreground">
          {order.status !== "completed" && order.status !== "cancelled" ? "Update order status:" : "Order closed"}
        </div>
        <Select
          value={order.status}
          onValueChange={(value) => onUpdateStatus(order.id, value)}
          disabled={order.status === "completed" || order.status === "cancelled"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {getStatusOptions(order.status).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )
}
