"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, MapPin, Navigation, Phone, User } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DeliveryMap } from "@/components/delivery-map"
import { DeliveryProgressBar } from "@/components/delivery-progress-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Sample data for active deliveries
const activeDeliveries = [
  {
    id: "order-5",
    restaurantName: "Taco Bell",
    restaurantAddress: "123 Union Place, Colombo 02",
    customerName: "Sarah Johnson",
    customerPhone: "+94 77 123 4567",
    customerAddress: "45 Park Street, Colombo 02",
    items: "3x Crunchy Tacos, 1x Burrito Supreme, 2x Mountain Dew",
    orderTotal: "Rs. 1,850",
    paymentMethod: "Cash on Delivery",
    status: "picking-up",
    estimatedDeliveryTime: "12:45 PM",
    coordinates: { lat: 6.9271, lng: 79.8612 },
  },
  {
    id: "order-6",
    restaurantName: "Domino's Pizza",
    restaurantAddress: "78 Duplication Road, Colombo 04",
    customerName: "Michael Chen",
    customerPhone: "+94 76 987 6543",
    customerAddress: "22 Marine Drive, Colombo 06",
    items: "1x Large Hawaiian Pizza, 1x Garlic Bread, 1x Chocolate Lava Cake",
    orderTotal: "Rs. 2,200",
    paymentMethod: "Card Payment",
    status: "on-the-way",
    estimatedDeliveryTime: "1:15 PM",
    coordinates: { lat: 6.9101, lng: 79.8528 },
  },
]

// Sample data for past deliveries
const pastDeliveries = [
  {
    id: "order-7",
    date: "Today, 10:30 AM",
    restaurantName: "McDonald's",
    customerAddress: "33 Galle Road, Colombo 03",
    amount: "Rs. 1,450",
    status: "completed",
  },
  {
    id: "order-8",
    date: "Yesterday, 7:45 PM",
    restaurantName: "Pizza Hut",
    customerAddress: "88 Baseline Road, Colombo 08",
    amount: "Rs. 2,100",
    status: "completed",
  },
  {
    id: "order-9",
    date: "Yesterday, 1:20 PM",
    restaurantName: "KFC",
    customerAddress: "55 Nawam Mawatha, Colombo 02",
    amount: "Rs. 1,750",
    status: "completed",
  },
  {
    id: "order-10",
    date: "2 days ago, 8:15 PM",
    restaurantName: "Burger King",
    customerAddress: "77 Reid Avenue, Colombo 07",
    amount: "Rs. 1,200",
    status: "completed",
  },
  {
    id: "order-11",
    date: "2 days ago, 12:40 PM",
    restaurantName: "Subway",
    customerAddress: "99 Horton Place, Colombo 07",
    amount: "Rs. 950",
    status: "completed",
  },
]

export default function MyDeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState(activeDeliveries[0])
  const { toast } = useToast()

  const handleStatusUpdate = (newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Order status updated to: ${newStatus}`,
    })
    // In a real app, you would update the state and make an API call here
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">My Deliveries</h1>
          <p className="text-muted-foreground">Manage your current and past deliveries</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="active" className="flex-1 md:flex-none">
              Active Deliveries
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1 md:flex-none">
              Past Deliveries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeDeliveries.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                {/* Map and Delivery Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Delivery</CardTitle>
                    <CardDescription>Live tracking and navigation</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <DeliveryMap
                      deliveries={[selectedDelivery]}
                      selectedDeliveryId={selectedDelivery.id}
                      onMarkerClick={() => {}}
                    />
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4 border-t p-6">
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Delivery Progress</h3>
                        <span className="text-sm text-muted-foreground">
                          ETA: {selectedDelivery.estimatedDeliveryTime}
                        </span>
                      </div>
                      <DeliveryProgressBar status={selectedDelivery.status} />
                    </div>
                    <div className="flex w-full flex-col gap-4 rounded-lg border bg-muted/30 p-4">
                      <div>
                        <h3 className="font-medium">Restaurant</h3>
                        <div className="mt-1 flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm">{selectedDelivery.restaurantName}</p>
                            <p className="text-sm text-muted-foreground">{selectedDelivery.restaurantAddress}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Customer</h3>
                        <div className="mt-1 flex items-start gap-2">
                          <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm">{selectedDelivery.customerName}</p>
                            <p className="text-sm text-muted-foreground">{selectedDelivery.customerAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full justify-between gap-4">
                      <Button variant="outline" className="flex-1">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Customer
                      </Button>
                      <Button className="flex-1">
                        <Navigation className="mr-2 h-4 w-4" />
                        Navigate
                      </Button>
                    </div>
                    {selectedDelivery.status === "picking-up" ? (
                      <Button
                        className="w-full"
                        onClick={() => handleStatusUpdate("Order picked up, on the way to customer")}
                      >
                        Mark as Picked Up
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => handleStatusUpdate("Order delivered")}>
                        Mark as Delivered
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                {/* Order Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Order #{selectedDelivery.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-medium">Items</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedDelivery.items}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Order Total</span>
                        <span className="text-sm font-medium">{selectedDelivery.orderTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Method</span>
                        <span className="text-sm">{selectedDelivery.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3">
                      <h3 className="text-sm font-medium">Delivery Instructions</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Please call when you arrive. The gate code is #1234. Leave at the door if no answer.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2 border-t">
                    <div className="flex w-full items-center justify-between py-2">
                      <span className="text-sm font-medium">Contact Support</span>
                      <Button variant="ghost" size="sm">
                        Get Help
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No Active Deliveries</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any active deliveries at the moment.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/available-deliveries">Find Available Orders</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>Your past deliveries and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <h3 className="font-medium">{delivery.restaurantName}</h3>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{delivery.customerAddress}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{delivery.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{delivery.amount}</p>
                        <Button variant="ghost" size="sm" className="mt-1 h-7 gap-1 px-2 text-xs">
                          Details <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <div>
                  <p className="text-sm font-medium">Total Earnings (This Week)</p>
                  <p className="text-2xl font-bold">Rs. 7,450</p>
                </div>
                <Button variant="outline">Download Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
