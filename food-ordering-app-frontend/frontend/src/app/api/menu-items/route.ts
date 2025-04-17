import { NextResponse } from "next/server"
import type { MenuItem } from "@/lib/api"

// This is a mock database for demonstration purposes
const menuItems: MenuItem[] = [
  {
    id: "item1",
    name: "Tasty Vegetable Salad Healthy Diet",
    description: "Fresh vegetables with our special dressing",
    price: 17.99,
    image: "/placeholder.svg?height=250&width=400",
    category: "cat5",
    isVeg: true,
    discount: 20,
    restaurantId: "rest1",
  },
  {
    id: "item2",
    name: "Original Chess Meat Burger With Chips",
    description: "Juicy beef patty with cheese and chips",
    price: 23.99,
    image: "/placeholder.svg?height=250&width=400",
    category: "cat6",
    isVeg: false,
    discount: 0,
    restaurantId: "rest1",
  },
  {
    id: "item3",
    name: "Tacos Salsa With Chickens Grilled",
    description: "Grilled chicken tacos with fresh salsa",
    price: 14.99,
    image: "/placeholder.svg?height=250&width=400",
    category: "cat5",
    isVeg: false,
    discount: 0,
    restaurantId: "rest1",
  },
  {
    id: "item4",
    name: "Fresh Orange Juice With Basil Seed",
    description: "Refreshing orange juice with basil seeds",
    price: 8.99,
    image: "/placeholder.svg?height=250&width=400",
    category: "cat2",
    isVeg: true,
    discount: 0,
    restaurantId: "rest1",
  },
  {
    id: "item5",
    name: "Meat Sushi Maki With Tuna, Ship And Other",
    description: "Assorted sushi with tuna and seafood",
    price: 26.99,
    image: "/placeholder.svg?height=250&width=400",
    category: "cat5",
    isVeg: false,
    discount: 0,
    restaurantId: "rest1",
  },
  {
    id: "item6",
    name: "Original Chess Burger With French Fries",
    description: "Classic cheeseburger with crispy fries",
    price: 21.99,
    image: "/placeholder.svg?height=250&width=400",
    category: "cat6",
    isVeg: false,
    discount: 20,
    restaurantId: "rest1",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get("categoryId")
  const restaurantId = searchParams.get("restaurantId")

  let filteredItems = [...menuItems]

  if (categoryId && categoryId !== "cat1") {
    filteredItems = filteredItems.filter((item) => item.category === categoryId)
  }

  if (restaurantId) {
    filteredItems = filteredItems.filter((item) => item.restaurantId === restaurantId)
  }

  return NextResponse.json(filteredItems)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.price || !data.category || !data.restaurantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new menu item
    const newMenuItem: MenuItem = {
      id: `item${Date.now()}`,
      name: data.name,
      description: data.description || "",
      price: Number.parseFloat(data.price) || 0,
      image: data.image || "/placeholder.svg?height=250&width=400",
      category: data.category,
      isVeg: Boolean(data.isVeg),
      discount: Number.parseInt(data.discount) || 0,
      restaurantId: data.restaurantId,
    }

    // Add to mock database
    menuItems.push(newMenuItem)

    return NextResponse.json(newMenuItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
