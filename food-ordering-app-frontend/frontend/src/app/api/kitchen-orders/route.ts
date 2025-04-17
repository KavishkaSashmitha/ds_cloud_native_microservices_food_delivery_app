import { NextResponse } from "next/server"
import type { KitchenOrder } from "@/lib/api"

// This is a mock database for demonstration purposes
const kitchenOrders: KitchenOrder[] = [
  {
    id: "T1",
    itemCount: 6,
    kitchen: "Kitchen",
    status: "Process",
  },
  {
    id: "T2",
    itemCount: 4,
    kitchen: "Kitchen",
    status: "Process",
  },
]

export async function GET() {
  return NextResponse.json(kitchenOrders)
}
