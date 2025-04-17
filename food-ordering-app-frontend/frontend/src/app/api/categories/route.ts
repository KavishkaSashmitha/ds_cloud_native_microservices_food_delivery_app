import { NextResponse } from "next/server"
import type { Category } from "@/lib/api"

// This is a mock database for demonstration purposes
const categories: Category[] = [
  { id: "cat1", name: "All", icon: "grid", itemCount: 235 },
  { id: "cat2", name: "Breakfast", icon: "coffee", itemCount: 19 },
  { id: "cat3", name: "Soups", icon: "soup", itemCount: 8 },
  { id: "cat4", name: "Pasta", icon: "utensils", itemCount: 14 },
  { id: "cat5", name: "Main Course", icon: "chef-hat", itemCount: 27 },
  { id: "cat6", name: "Burgers", icon: "hamburger", itemCount: 13 },
]

export async function GET() {
  return NextResponse.json(categories)
}
