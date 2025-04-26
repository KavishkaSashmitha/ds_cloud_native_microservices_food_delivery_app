"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, MapPin, Search } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RestaurantCard } from "@/components/restaurant-card"

// Mock data for restaurants
const restaurants = [
  {
    id: "1",
    name: "Burger Palace",
    image: "/placeholder.svg?height=200&width=300",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 2.99,
    minOrder: 10,
    distance: "1.2 km",
    featured: true,
  },
  {
    id: "2",
    name: "Pizza Heaven",
    image: "/placeholder.svg?height=200&width=300",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "25-35 min",
    deliveryFee: 3.49,
    minOrder: 15,
    distance: "2.5 km",
    featured: true,
  },
  {
    id: "3",
    name: "Sushi Express",
    image: "/placeholder.svg?height=200&width=300",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "30-40 min",
    deliveryFee: 4.99,
    minOrder: 20,
    distance: "3.0 km",
    featured: true,
  },
  {
    id: "4",
    name: "Taco Fiesta",
    image: "/placeholder.svg?height=200&width=300",
    cuisine: "Mexican",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: 2.49,
    minOrder: 12,
    distance: "1.8 km",
    featured: false,
  },
  {
    id: "5",
    name: "Curry House",
    image: "/placeholder.svg?height=200&width=300",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "25-40 min",
    deliveryFee: 3.99,
    minOrder: 18,
    distance: "2.7 km",
    featured: false,
  },
  {
    id: "6",
    name: "Noodle Bar",
    image: "/placeholder.svg?height=200&width=300",
    cuisine: "Chinese",
    rating: 4.4,
    deliveryTime: "20-35 min",
    deliveryFee: 3.29,
    minOrder: 15,
    distance: "2.2 km",
    featured: false,
  },
]

// Mock data for food categories
const categories = [
  { id: "1", name: "Burgers", icon: "🍔" },
  { id: "2", name: "Pizza", icon: "🍕" },
  { id: "3", name: "Sushi", icon: "🍣" },
  { id: "4", name: "Tacos", icon: "🌮" },
  { id: "5", name: "Curry", icon: "🍛" },
  { id: "6", name: "Noodles", icon: "🍜" },
  { id: "7", name: "Salads", icon: "🥗" },
  { id: "8", name: "Desserts", icon: "🍰" },
]

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter restaurants based on active tab and search query
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesTab = activeTab === "all" || (activeTab === "featured" && restaurant.featured)
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="mb-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold md:text-3xl">Hello, {user?.name || "Food Lover"}!</h1>
            <p className="max-w-md text-orange-100">
              Hungry? We've got you covered. Order delicious food from your favorite restaurants.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for restaurants or cuisines..."
                className="h-10 rounded-full bg-white pl-9 pr-4 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="/placeholder.svg?height=150&width=200"
              alt="Food delivery"
              width={200}
              height={150}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section className="mb-8 flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium">Deliver to:</p>
            <p className="text-sm text-gray-600">123 Main Street, Apt 4B, New York, NY 10001</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Change
        </Button>
      </section>

      {/* Categories Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Categories</h2>
          <Button variant="link" className="text-orange-500">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/customer/categories/${category.id}`}
              className="flex flex-col items-center gap-2 rounded-lg border bg-white p-4 text-center transition-colors hover:border-orange-200 hover:bg-orange-50"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Restaurants</h2>
          <Link href="/customer/restaurants">
            <Button variant="link" className="text-orange-500">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            {filteredRestaurants.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border bg-white">
                <p className="text-lg font-medium">No restaurants found</p>
                <p className="text-sm text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
