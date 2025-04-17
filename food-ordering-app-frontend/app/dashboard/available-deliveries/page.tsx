"use client"

import { useState } from "react"
import { Clock, MapPin, Navigation, Package, Search } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DeliveryMap } from "@/components/delivery-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Sample data for available deliveries
const availableDeliveries = [
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
  {
    id: "order-3",
    restaurantName: "Burger King",
    restaurantAddress: "222 Galle Road, Colombo 06",
    customerAddress: "333 Beach Road, Colombo 04",
    items: "1x Whopper, 1x Chicken Royale, 2x Fries",
    distance: "1.8 km",
    estimatedTime: "10-15 min",
    paymentAmount: "Rs. 950",
    coordinates: { lat: 6.9344, lng: 79.8428 },
  },
  {
    id: "order-4",
    restaurantName: "KFC",
    restaurantAddress: "555 Liberty Plaza, Colombo 03",
    customerAddress: "777 Independence Ave, Colombo 07",
    items: "8pc Bucket, 2x Coleslaw, 1x Large Pepsi",
    distance: "4.2 km",
    estimatedTime: "25-30 min",
    paymentAmount: "Rs. 2200",
    coordinates: { lat: 6.9165, lng: 79.8487 },
  },
]

export default function AvailableDeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredDeliveries = availableDeliveries.filter(
    (delivery) =>
      delivery.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.restaurantAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAcceptDelivery = (deliveryId: string) => {
    toast({
      title: "Delivery Accepted",
      description: `You have accepted order #${deliveryId}. Navigate to the restaurant to pick up the order.`,
    })
    // In a real app, you would update the state and make an API call here
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Available Deliveries</h1>
          <p className="text-muted-foreground">Browse and accept available delivery orders in your area.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Map Section */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Delivery Map</CardTitle>
              <CardDescription>Available orders in your area</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DeliveryMap
                deliveries={availableDeliveries}
                selectedDeliveryId={selectedDelivery}
                onMarkerClick={(id) => setSelectedDelivery(id)}
              />
            </CardContent>
          </Card>

          {/* Delivery List Section */}
          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle>Available Orders</CardTitle>
              <CardDescription>Orders ready for pickup</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto p-0">
              <Tabs defaultValue="nearby">
                <div className="px-6 pt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="nearby" className="flex-1">
                      Nearby
                    </TabsTrigger>
                    <TabsTrigger value="best-match" className="flex-1">
                      Best Match
                    </TabsTrigger>
                    <TabsTrigger value="highest-pay" className="flex-1">
                      Highest Pay
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="nearby" className="m-0">
                  <div className="divide-y px-6">
                    {filteredDeliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className={`py-4 ${selectedDelivery === delivery.id ? "bg-muted/50" : ""}`}
                        onClick={() => setSelectedDelivery(delivery.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{delivery.restaurantName}</h3>
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span>{delivery.distance}</span>
                              <span className="mx-2">•</span>
                              <Clock className="mr-1 h-3 w-3" />
                              <span>{delivery.estimatedTime}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{delivery.paymentAmount}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <div className="flex items-start">
                            <Package className="mr-2 mt-0.5 h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{delivery.items}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAcceptDelivery(delivery.id)
                            }}
                          >
                            Accept Delivery
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="best-match" className="m-0">
                  <div className="flex h-40 items-center justify-center text-muted-foreground">
                    Same orders sorted by best match algorithm
                  </div>
                </TabsContent>
                <TabsContent value="highest-pay" className="m-0">
                  <div className="flex h-40 items-center justify-center text-muted-foreground">
                    Same orders sorted by payment amount
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t bg-muted/50 p-4">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium">Online Status</span>
                <span className="flex items-center text-sm font-medium text-green-500">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                  Available for Deliveries
                </span>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                <Navigation className="mr-2 h-4 w-4" />
                Update Your Location
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
