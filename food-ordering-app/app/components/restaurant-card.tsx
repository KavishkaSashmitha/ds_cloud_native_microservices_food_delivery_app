import Link from "next/link"
import { Clock, Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RestaurantCardProps {
  name: string
  image: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryFee: string
}

export function RestaurantCard({ name, image, cuisine, rating, deliveryTime, deliveryFee }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-video w-full overflow-hidden">
          <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <Badge variant="secondary" className="mt-2">
            {cuisine}
          </Badge>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{deliveryTime}</span>
          </div>
          <div>{deliveryFee}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}

