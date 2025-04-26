"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Download, Filter, Search } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for delivery history
const deliveryHistory = [
  {
    id: "order-101",
    date: "2025-04-15",
    time: "12:30 PM",
    restaurantName: "Pizza Hut",
    customerAddress: "123 Main St, Colombo 03",
    amount: "Rs. 1,250",
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "order-102",
    date: "2025-04-14",
    time: "7:45 PM",
    restaurantName: "McDonald's",
    customerAddress: "456 Park Ave, Colombo 05",
    amount: "Rs. 950",
    status: "completed",
    paymentMethod: "Card",
  },
  {
    id: "order-103",
    date: "2025-04-14",
    time: "1:15 PM",
    restaurantName: "KFC",
    customerAddress: "789 High St, Colombo 04",
    amount: "Rs. 1,800",
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "order-104",
    date: "2025-04-13",
    time: "6:20 PM",
    restaurantName: "Burger King",
    customerAddress: "101 Lake Side, Colombo 08",
    amount: "Rs. 1,100",
    status: "completed",
    paymentMethod: "Card",
  },
  {
    id: "order-105",
    date: "2025-04-12",
    time: "8:10 PM",
    restaurantName: "Domino's Pizza",
    customerAddress: "222 Galle Road, Colombo 06",
    amount: "Rs. 2,200",
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "order-106",
    date: "2025-04-11",
    time: "12:45 PM",
    restaurantName: "Subway",
    customerAddress: "333 Beach Road, Colombo 04",
    amount: "Rs. 850",
    status: "completed",
    paymentMethod: "Card",
  },
  {
    id: "order-107",
    date: "2025-04-10",
    time: "7:30 PM",
    restaurantName: "Taco Bell",
    customerAddress: "555 Liberty Plaza, Colombo 03",
    amount: "Rs. 1,450",
    status: "completed",
    paymentMethod: "Cash",
  },
]

// Weekly earnings data
const weeklyEarnings = [
  { week: "Apr 8 - Apr 14", amount: "Rs. 7,450", deliveries: 12 },
  { week: "Apr 1 - Apr 7", amount: "Rs. 8,200", deliveries: 14 },
  { week: "Mar 25 - Mar 31", amount: "Rs. 6,800", deliveries: 11 },
  { week: "Mar 18 - Mar 24", amount: "Rs. 7,950", deliveries: 13 },
]

export default function DeliveryHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all-time")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const filteredDeliveries = deliveryHistory.filter((delivery) => {
    const matchesSearch =
      delivery.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPayment =
      paymentFilter === "all" || delivery.paymentMethod.toLowerCase() === paymentFilter.toLowerCase()

    // Simple date filtering for demo purposes
    let matchesDate = true
    if (dateFilter === "this-week") {
      matchesDate = ["2025-04-14", "2025-04-15"].includes(delivery.date)
    } else if (dateFilter === "this-month") {
      matchesDate = delivery.date.startsWith("2025-04")
    }

    return matchesSearch && matchesPayment && matchesDate
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Delivery History</h1>
          <p className="text-muted-foreground">View your past deliveries and earnings</p>
        </div>

        <Tabs defaultValue="deliveries" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="deliveries" className="flex-1 md:flex-none">
              Deliveries
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex-1 md:flex-none">
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Deliveries</CardTitle>
                <CardDescription>Browse and search your delivery history</CardDescription>
                <div className="mt-4 flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by restaurant, address, or order ID..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <SelectValue placeholder="Date Range" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-time">All Time</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Payment Method" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b bg-muted/50 p-4 font-medium md:grid-cols-[1fr_2fr_1fr_auto]">
                    <div>Date & Time</div>
                    <div className="hidden md:block">Restaurant & Location</div>
                    <div className="md:hidden">Restaurant</div>
                    <div>Amount</div>
                    <div></div>
                  </div>
                  <div className="divide-y">
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((delivery) => (
                        <div
                          key={delivery.id}
                          className="grid grid-cols-[1fr_1fr_auto] gap-4 p-4 md:grid-cols-[1fr_2fr_1fr_auto]"
                        >
                          <div className="flex flex-col">
                            <span>{delivery.date.split("-").slice(1).join("/")}</span>
                            <span className="text-sm text-muted-foreground">{delivery.time}</span>
                          </div>
                          <div className="flex flex-col">
                            <span>{delivery.restaurantName}</span>
                            <span className="truncate text-sm text-muted-foreground md:text-ellipsis">
                              {delivery.customerAddress}
                            </span>
                          </div>
                          <div className="font-medium">{delivery.amount}</div>
                          <div>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              Details <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-32 items-center justify-center text-muted-foreground">
                        No deliveries found matching your filters
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredDeliveries.length} of {deliveryHistory.length} deliveries
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>View your earnings by week or month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-muted/30 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Earnings (This Month)</h3>
                    <p className="mt-1 text-3xl font-bold">Rs. 15,650</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Deliveries</h3>
                    <p className="mt-1 text-3xl font-bold">26</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Average Per Delivery</h3>
                    <p className="mt-1 text-3xl font-bold">Rs. 602</p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 border-b bg-muted/50 p-4 font-medium">
                    <div>Week</div>
                    <div>Deliveries</div>
                    <div>Amount</div>
                  </div>
                  <div className="divide-y">
                    {weeklyEarnings.map((week, index) => (
                      <div key={index} className="grid grid-cols-[2fr_1fr_1fr] gap-4 p-4">
                        <div>{week.week}</div>
                        <div>{week.deliveries}</div>
                        <div className="font-medium">{week.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 font-medium">Earnings Breakdown</h3>
                  <div className="h-[300px] rounded-lg border bg-muted/30 p-4">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      Earnings chart will be displayed here
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t">
                <Select defaultValue="april">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="april">April 2025</SelectItem>
                    <SelectItem value="march">March 2025</SelectItem>
                    <SelectItem value="february">February 2025</SelectItem>
                    <SelectItem value="january">January 2025</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
