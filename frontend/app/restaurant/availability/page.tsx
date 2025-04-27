"use client"

import { useState } from "react"
import { Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Initial hours
const initialHours = daysOfWeek.map((day) => ({
  day,
  isOpen: day !== "Sunday",
  openTime: "09:00",
  closeTime: "22:00",
}))

// Initial food items availability
const initialFoodAvailability = [
  {
    id: "1",
    name: "Classic Burger",
    category: "Main Courses",
    available: true,
  },
  {
    id: "2",
    name: "Caesar Salad",
    category: "Appetizers",
    available: true,
  },
  {
    id: "3",
    name: "Chocolate Cake",
    category: "Desserts",
    available: false,
  },
  {
    id: "4",
    name: "Iced Tea",
    category: "Beverages",
    available: true,
  },
  {
    id: "5",
    name: "Margherita Pizza",
    category: "Main Courses",
    available: true,
  },
  {
    id: "6",
    name: "Chicken Wings",
    category: "Appetizers",
    available: true,
  },
]

export default function RestaurantAvailability() {
  const [restaurantOpen, setRestaurantOpen] = useState(true)
  const [acceptingOrders, setAcceptingOrders] = useState(true)
  const [hours, setHours] = useState(initialHours)
  const [foodItems, setFoodItems] = useState(initialFoodAvailability)
  const [activeTab, setActiveTab] = useState("hours")

  // Update day hours
  const updateHours = (day: string, field: "isOpen" | "openTime" | "closeTime", value: any) => {
    setHours(hours.map((item) => (item.day === day ? { ...item, [field]: value } : item)))
  }

  // Toggle food item availability
  const toggleFoodAvailability = (id: string) => {
    setFoodItems(foodItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Availability Management</h1>
        <p className="text-muted-foreground">Manage your restaurant's availability and menu items</p>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Restaurant Status</CardTitle>
            <CardDescription>Control your restaurant's overall availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="restaurant-open">Restaurant Open</Label>
                  <p className="text-sm text-muted-foreground">Turn off to mark your restaurant as closed</p>
                </div>
                <Switch id="restaurant-open" checked={restaurantOpen} onCheckedChange={setRestaurantOpen} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accepting-orders">Accepting Orders</Label>
                  <p className="text-sm text-muted-foreground">Turn off to temporarily stop receiving new orders</p>
                </div>
                <Switch id="accepting-orders" checked={acceptingOrders} onCheckedChange={setAcceptingOrders} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage special situations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>Estimated Preparation Time</Label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue placeholder="Select preparation time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Special Notice</Label>
                <div className="flex gap-2">
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No special notice</SelectItem>
                      <SelectItem value="busy">We're very busy</SelectItem>
                      <SelectItem value="closing">Closing soon</SelectItem>
                      <SelectItem value="limited">Limited menu available</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hours" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="hours">
            <Clock className="mr-2 h-4 w-4" />
            Business Hours
          </TabsTrigger>
          <TabsTrigger value="items">
            <Calendar className="mr-2 h-4 w-4" />
            Menu Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your restaurant's operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hours.map((day) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-28">
                      <span className="font-medium">{day.day}</span>
                    </div>
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) => updateHours(day.day, "isOpen", checked)}
                    />
                    <div className="flex flex-1 items-center gap-2">
                      <Select
                        value={day.openTime}
                        onValueChange={(value) => updateHours(day.day, "openTime", value)}
                        disabled={!day.isOpen}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Open" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => {
                            const hour = i.toString().padStart(2, "0")
                            return (
                              <SelectItem key={`open-${hour}:00`} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={day.closeTime}
                        onValueChange={(value) => updateHours(day.day, "closeTime", value)}
                        disabled={!day.isOpen}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Close" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => {
                            const hour = i.toString().padStart(2, "0")
                            return (
                              <SelectItem key={`close-${hour}:00`} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items Availability</CardTitle>
              <CardDescription>Manage which items are available for ordering</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {foodItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.available ? "Available" : "Unavailable"}</span>
                      <Switch checked={item.available} onCheckedChange={() => toggleFoodAvailability(item.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
