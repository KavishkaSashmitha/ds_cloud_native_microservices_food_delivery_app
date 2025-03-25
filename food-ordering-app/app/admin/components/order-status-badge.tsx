import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: "pending" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">
          Pending
        </Badge>
      )
    case "preparing":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
          Preparing
        </Badge>
      )
    case "out-for-delivery":
      return (
        <Badge variant="outline" className="text-purple-600 border-purple-600 bg-purple-50">
          Out for Delivery
        </Badge>
      )
    case "delivered":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
          Delivered
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

