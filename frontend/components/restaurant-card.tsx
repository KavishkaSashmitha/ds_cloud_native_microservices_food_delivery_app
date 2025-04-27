import Link from "next/link"
import Image from "next/image"
import { Clock, Star, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface Restaurant {
  id: string
  name: string
  image: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  distance: string
  featured?: boolean
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/customer/restaurants/${restaurant.id}`}>
      <div className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {restaurant.featured && (
            <Badge className="absolute left-2 top-2 bg-orange-500 hover:bg-orange-600">Featured</Badge>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{restaurant.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>
          <p className="mb-3 text-sm text-gray-600">{restaurant.cuisine}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
            </div>
            <div>
              <span>Min. ${restaurant.minOrder}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
