import { Clock, MapPin, Phone } from "lucide-react"

interface RestaurantInfoProps {
  restaurant: {
    name: string
    address: string
    deliveryTime: string
    deliveryFee: string
    description: string
  }
}

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Hours</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Monday</div>
          <div>11:00 AM - 10:00 PM</div>
          <div>Tuesday</div>
          <div>11:00 AM - 10:00 PM</div>
          <div>Wednesday</div>
          <div>11:00 AM - 10:00 PM</div>
          <div>Thursday</div>
          <div>11:00 AM - 10:00 PM</div>
          <div>Friday</div>
          <div>11:00 AM - 11:00 PM</div>
          <div>Saturday</div>
          <div>11:00 AM - 11:00 PM</div>
          <div>Sunday</div>
          <div>12:00 PM - 9:00 PM</div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>(555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Delivery Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Delivery Time: {restaurant.deliveryTime}</span>
          </div>
          <div>Delivery Fee: {restaurant.deliveryFee}</div>
          <div>Minimum Order: $10.00</div>
        </div>
      </div>
    </div>
  )
}

