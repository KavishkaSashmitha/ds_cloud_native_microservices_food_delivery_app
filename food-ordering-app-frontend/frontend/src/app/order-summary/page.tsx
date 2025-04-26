"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft, CreditCard, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { loadStripe } from "@stripe/stripe-js"
import { toast } from "@/components/ui/use-toast"

type Orders = {
    _id: string
    user: string
    items: {
      foodId: string
      quantity: number
      _id: string
    }[]
    totalAmount: number
    deliveryAddress: string
    paymentMethod?: string
    status: string
    createdAt: string
  }
  

interface OrderItem {
  foodId: string
  foodName: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  items: OrderItem[]
  totalAmount: number
  deliveryAddress: string
  paymentMethod: string
  status: string
  createdAt: Date
}

export default function OrderSummary() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch the order details from your backend (MongoDB database)
        const response = await fetch("http://localhost:5000/orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details from the server")
        }

        const allOrders: Order[] = await response.json()

      const sortedOrders = allOrders.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      const lastOrder = sortedOrders[sortedOrders.length - 1]
      setOrder(lastOrder)
        // const data = await response.json()
        // setOrder(data) // Assuming the response contains the order details
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the order.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [])

  const handleBackToOrder = () => {
    router.push("/")
  }

  const handleProceedToPayment = async () => {
    // Ensure we have order details
    if (!order) return;

    try {
      // Send the payment request to your backend
      const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(order.totalAmount * 100), // Amount in cents
          orderId: "680be5d289a0b58efff603d1", // Use actual order id from the DB
        }),
      })

      const data = await response.json()

      const stripe = await stripePromise

      if (stripe && data.sessionId) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (result.error) {
          toast({ title: "Stripe Error", description: result.error.message })
        }
      } else {
        toast({ title: "Stripe Error", description: "No client secret received." })
      }
    } catch (err: any) {
      console.error(err)
      toast({ title: "Payment Error", description: err.message })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-lg text-orange-800">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <Button onClick={handleBackToOrder} className="mt-4 bg-orange-500 hover:bg-orange-600">
            Go to Order Page
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">No order found. Please place an order first.</p>
          <Button onClick={handleBackToOrder} className="mt-4 bg-orange-500 hover:bg-orange-600">
            Go to Order Page
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatPrice = (value: number) => (isNaN(value) ? "0.00" : value.toFixed(2))

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4">
        <Button
          onClick={handleBackToOrder}
        //   variant="ghost"
          className="mb-6 flex items-center text-orange-700 hover:text-orange-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Button>

        {/* <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-orange-800">Order Summary</h1>
          <div className="mt-2 flex items-center justify-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Order Received</span>
          </div>
        </div> */}

        <Card className="mx-auto max-w-4xl border-orange-200 bg-orange-50 shadow-md">
          <CardHeader className="bg-orange-500 text-white -mt-4 -ml-4 w-[896px] pt-6 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl ml-6">Order Summary</CardTitle>
              {/* <div className="rounded-full bg-white px-3 py-1 text-sm font-medium text-orange-600">{order.status}</div> */}
            </div>
            {/* <p className="mt-2 text-sm opacity-90">Placed on {formatDate(order.createdAt.toString())}</p> */}
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Order Items */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-orange-800">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 rounded-md border border-orange-100 bg-white p-3"
                  >
                    {item.image && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-orange-200">
                        <img
                          src={item.image || "/https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=80&h=80&fit=crop&auto=format"}
                          alt={item.foodName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.foodName}</h4>
                      <p className="text-sm text-gray-500">
                        ${formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-medium">${formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-orange-100" />

            {/* Order Summary */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-orange-800">Order Summary</h3>
              <div className="space-y-2 rounded-md bg-orange-100 p-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-2 bg-orange-200" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="mb-2 text-lg font-medium text-orange-800">Delivery Address</h3>
              <div className="rounded-md border border-orange-100 bg-white p-4">
                <p className="whitespace-pre-wrap">{order.deliveryAddress}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="mb-2 text-lg font-medium text-orange-800">Payment Method</h3>
              <div className="flex items-center rounded-md border border-orange-100 bg-white p-4">
                {order.paymentMethod === "Card" ? (
                  <>
                    <CreditCard className="mr-2 h-5 w-5 text-orange-600" />
                    <span>Credit/Debit Card</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2 text-lg"></span>
                    <span>Cash on Delivery</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 bg-orange-50 px-6 py-4">
            <Button
              onClick={handleBackToOrder}
              variant="outline"
              className="bg-orange-600 text-white hover:bg-orange-500 w-30"
            >
              Edit Order
            </Button>
            <Button
              onClick={handleProceedToPayment}
              className="bg-green-600 text-white hover:bg-green-500 h-10 w-35"
              disabled={order.paymentMethod === "Cash"}
            >
              {order.paymentMethod === "Card" ? "Pay Now" : "Confirm Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
