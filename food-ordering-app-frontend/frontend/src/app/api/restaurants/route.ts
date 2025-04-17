import { NextResponse } from "next/server"
import type { Restaurant } from "@/lib/api"

// This is a mock database for demonstration purposes
const restaurants: Restaurant[] = [
  {
    id: "rest1",
    name: "CHILI POS Restaurant",
    address: "123 Main St, City",
    contactNumber: "123-456-7890",
    email: "info@chilipos.com",
    logo: "/placeholder.svg?height=100&width=100",
  },
]

export async function GET() {
  return NextResponse.json(restaurants)
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.address || !data.contactNumber || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create new restaurant
    const newRestaurant: Restaurant = {
      id: `rest${Date.now()}`,
      name: data.name,
      address: data.address,
      contactNumber: data.contactNumber,
      email: data.email,
      logo: data.logo || "/placeholder.svg?height=100&width=100",
    };

    // Add to mock database
    restaurants.push(newRestaurant);

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
}
