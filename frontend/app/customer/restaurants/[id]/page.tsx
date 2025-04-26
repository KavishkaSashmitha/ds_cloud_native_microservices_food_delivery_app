"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Clock, Info, MapPin, Star, Truck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MenuItemCard } from "@/components/menu-item-card"

// Mock restaurant data
const restaurantsData = {
  "1": {
    id: "1",
    name: "Burger Palace",
    image: "/placeholder.svg?height=300&width=800",
    cuisine: "American",
    rating: 4.5,
    reviewCount: 243,
    deliveryTime: "20-30 min",
    deliveryFee: 2.99,
    minOrder: 10,
    distance: "1.2 km",
    address: "123 Burger Street, New York, NY 10001",
    description:
      "Serving the juiciest burgers in town since 2010. Our patties are made from 100% premium beef and served with fresh ingredients.",
    openingHours: "10:00 AM - 10:00 PM",
  },
  "2": {
    id: "2",
    name: "Pizza Heaven",
    image: "/placeholder.svg?height=300&width=800",
    cuisine: "Italian",
    rating: 4.7,
    reviewCount: 187,
    deliveryTime: "25-35 min",
    deliveryFee: 3.49,
    minOrder: 15,
    distance: "2.5 km",
    address: "456 Pizza Avenue, New York, NY 10002",
    description:
      "Authentic Italian pizzas made with traditional recipes. Our wood-fired oven gives our pizzas that perfect crispy crust.",
    openingHours: "11:00 AM - 11:00 PM",
  },
  "3": {
    id: "3",
    name: "Sushi Express",
    image: "/placeholder.svg?height=300&width=800",
    cuisine: "Japanese",
    rating: 4.8,
    reviewCount: 156,
    deliveryTime: "30-40 min",
    deliveryFee: 4.99,
    minOrder: 20,
    distance: "3.0 km",
    address: "789 Sushi Lane, New York, NY 10003",
    description:
      "Fresh and delicious sushi made by experienced chefs. We use only the highest quality fish and ingredients.",
    openingHours: "12:00 PM - 10:00 PM",
  },
}

// Mock menu categories
const menuCategories = [
  { id: "popular", name: "Popular Items" },
  { id: "starters", name: "Starters" },
  { id: "main", name: "Main Courses" },
  { id: "sides", name: "Sides" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
]

// Mock menu items
const menuItemsData = {
  "1": [
    {
      id: "101",
      name: "Classic Cheeseburger",
      description: "Beef patty with cheddar cheese, lettuce, tomato, and special sauce",
      price: 8.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "popular",
      options: [
        {
          name: "Size",
          choices: [
            { id: "s", name: "Regular", price: 0 },
            { id: "l", name: "Large", price: 2 },
          ],
        },
        {
          name: "Add-ons",
          choices: [
            { id: "bacon", name: "Bacon", price: 1.5 },
            { id: "cheese", name: "Extra Cheese", price: 1 },
            { id: "egg", name: "Fried Egg", price: 1.5 },
          ],
        },
      ],
    },
    {
      id: "102",
      name: "BBQ Bacon Burger",
      description: "Beef patty with bacon, cheddar, onion rings, and BBQ sauce",
      price: 10.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "popular",
    },
    {
      id: "103",
      name: "Veggie Burger",
      description: "Plant-based patty with lettuce, tomato, and vegan mayo",
      price: 9.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "main",
    },
    {
      id: "104",
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      price: 3.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "sides",
    },
    {
      id: "105",
      name: "Onion Rings",
      description: "Crispy battered onion rings",
      price: 4.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "sides",
    },
    {
      id: "106",
      name: "Chocolate Milkshake",
      description: "Rich and creamy chocolate milkshake",
      price: 4.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "drinks",
    },
    {
      id: "107",
      name: "Cheesecake",
      description: "New York style cheesecake with berry compote",
      price: 5.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "desserts",
    },
  ],
  "2": [
    {
      id: "201",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      price: 12.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "popular",
      options: [
        {
          name: "Size",
          choices: [
            { id: "m", name: "Medium", price: 0 },
            { id: "l", name: "Large", price: 4 },
            { id: "xl", name: "Extra Large", price: 6 },
          ],
        },
        {
          name: "Crust",
          choices: [
            { id: "thin", name: "Thin Crust", price: 0 },
            { id: "thick", name: "Thick Crust", price: 1 },
            { id: "stuffed", name: "Stuffed Crust", price: 2 },
          ],
        },
      ],
    },
    {
      id: "202",
      name: "Pepperoni Pizza",
      description: "Pizza with tomato sauce, mozzarella, and pepperoni",
      price: 14.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "popular",
    },
    {
      id: "203",
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter and herbs",
      price: 4.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "starters",
    },
  ],
  "3": [
    {
      id: "301",
      name: "California Roll",
      description: "Crab, avocado, and cucumber roll",
      price: 7.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "popular",
    },
    {
      id: "302",
      name: "Salmon Nigiri",
      description: "Fresh salmon over pressed vinegared rice",
      price: 6.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "popular",
    },
    {
      id: "303",
      name: "Miso Soup",
      description: "Traditional Japanese soup with tofu and seaweed",
      price: 3.99,
      image: "/placeholder.svg?height=120&width=120",
      category: "starters",
    },
  ],
}

export default function RestaurantPage() {
  const params = useParams()
  const restaurantId = params.id as string
  const restaurant = restaurantsData[restaurantId as keyof typeof restaurantsData]
  const menuItems = menuItemsData[restaurantId as keyof typeof menuItemsData] || []

  const [activeCategory, setActiveCategory] = useState("popular")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter menu items based on active category and search query
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!restaurant) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <h2 className="mb-2 text-2xl font-bold">Restaurant not found</h2>
        <p className="mb-6 text-gray-600">The restaurant you're looking for doesn't exist or has been removed.</p>
        <Link href="/customer/dashboard">
          <Button className="bg-orange-500 hover:bg-orange-600">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/customer/dashboard" className="mb-4 flex items-center text-gray-600 hover:text-orange-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to restaurants
        </Link>
      </div>

      {/* Restaurant Header */}
      <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="relative h-48 w-full md:h-64">
          <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        </div>
        <div className="p-6">
          <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.cuisine}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                <span>{restaurant.rating}</span>
                <span className="text-gray-500">({restaurant.reviewCount})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-orange-500" />
              <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span>{restaurant.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Info className="h-4 w-4 text-orange-500" />
              <span>Min. order ${restaurant.minOrder}</span>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-600">{restaurant.description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium">Address:</span> {restaurant.address}
            </div>
            <div>
              <span className="font-medium">Hours:</span> {restaurant.openingHours}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Menu</h2>
          <div className="mt-4">
            <Input
              type="search"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        <Tabs defaultValue="popular" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="mb-6 overflow-x-auto">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {menuCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-0">
            {filteredMenuItems.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border">
                <p className="text-lg font-medium">No items found</p>
                <p className="text-sm text-gray-500">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMenuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
