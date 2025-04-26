"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddFoodItemDialog } from "@/components/add-food-item-dialog"
import { FoodItemCard } from "@/components/food-item-card"

// Mock food categories
const categories = [
  { id: "all", name: "All Items" },
  { id: "appetizers", name: "Appetizers" },
  { id: "main-courses", name: "Main Courses" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
]

// Mock food items
const initialFoodItems = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and special sauce",
    price: 9.99,
    category: "main-courses",
    image: "/placeholder.svg?height=100&width=100",
    available: true,
  },
  {
    id: "2",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 7.99,
    category: "appetizers",
    image: "/placeholder.svg?height=100&width=100",
    available: true,
  },
  {
    id: "3",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with a layer of ganache",
    price: 6.99,
    category: "desserts",
    image: "/placeholder.svg?height=100&width=100",
    available: true,
  },
  {
    id: "4",
    name: "Iced Tea",
    description: "Refreshing iced tea with lemon",
    price: 2.99,
    category: "beverages",
    image: "/placeholder.svg?height=100&width=100",
    available: false,
  },
]

export default function RestaurantMenu() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [foodItems, setFoodItems] = useState(initialFoodItems)

  // Filter food items based on active tab and search query
  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = activeTab === "all" || item.category === activeTab
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Add new food item
  const handleAddFoodItem = (newItem: any) => {
    setFoodItems([
      ...foodItems,
      {
        ...newItem,
        id: (foodItems.length + 1).toString(),
        image: "/placeholder.svg?height=100&width=100",
      },
    ])
    setIsAddDialogOpen(false)
  }

  // Toggle food item availability
  const toggleAvailability = (id: string) => {
    setFoodItems(foodItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  // Delete food item
  const deleteItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id))
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's menu items</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="mb-2 text-center text-lg font-medium">No items found</p>
                <p className="text-center text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term"
                    : "Add your first menu item by clicking the 'Add Item' button"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  onToggleAvailability={toggleAvailability}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddFoodItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddFoodItem}
        categories={categories.filter((c) => c.id !== "all")}
      />
    </div>
  )
}
