"use client";

import type React from "react"
import { useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// import { loadStripe } from "@stripe/stripe-js"


// This would typically come from your database
const mockFoodItems = [
  {
    id: "123456789123456789123456",
    name: "Margherita Pizza",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: "123456789123456789123454",
    name: "Chicken Burger",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: "123456789123456789123450",
    name: "Caesar Salad",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: "123456789123456789123459",
    name: "Pasta Carbonara",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=80&h=80&fit=crop&auto=format",
  },
  {
    id: "123456789123456789123458",
    name: "Fish and Chips",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=80&h=80&fit=crop&auto=format",
  },
]

interface OrderItem {
  foodId: string
  foodName: string
  price: number
  quantity: number
  image?: string
}

export default function OrderForm() {
    const router = useRouter()
    const [items, setItems] = useState<OrderItem[]>([
      // {
      //   foodId: "1",
      //   foodName: "Margherita Pizza",
      //   price: 12.99,
      //   quantity: 1,
      //   image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=80&h=80&fit=crop&auto=format",
      // },
    ])
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("Cash")
    //   const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  
  
    const addItem = () => {
      setItems([...items, { foodId: "", foodName: "", price: 0, quantity: 1 }])
    }
  
    const removeItem = (index: number) => {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  
    const updateItem = (index: number, field: keyof OrderItem, value: any) => {
      const newItems = [...items]
  
      if (field === "foodId" && value) {
        const selectedFood = mockFoodItems.find((food) => food.id === value)
        if (selectedFood) {
          newItems[index] = {
            ...newItems[index],
            foodId: selectedFood.id,
            foodName: selectedFood.name,
            price: selectedFood.price,
            image: selectedFood.image,
          }
        }
      } else {
        newItems[index] = { ...newItems[index], [field]: value }
      }
  
      setItems(newItems)
    }
  
    const calculateTotal = () => {
      return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
  
      if (items.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one item to your order",
          type: "error",
        })
        return
      }
  
      if (!deliveryAddress) {
        toast({
          title: "Error",
          description: "Please provide a delivery address",
          type: "error",
        })
        return
      }
  
      const totalAmount = Number.parseFloat(calculateTotal());
  
      const orderPayload = {
          items: items.map((item) => ({
            foodId: item.foodId,
            quantity: item.quantity,
          })),
          totalAmount,
          deliveryAddress,
          paymentMethod,
          status: "Pending",
          createdAt: new Date(),
        }
      
      try {
        // First POST to save order in backend (optional)
        const orderRes = await fetch("http://localhost:5000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
    
        const orderData = await orderRes.json();
        const orderId = orderData._id;
  
        toast({
          title: "Order Placed",
          description: "Your order has been successfully placed!",
          className: "bg-orange-100 border-orange-500",
        })
        
        router.push("/order-summary")

      } catch (err: any) {
        console.error(err)
        toast({ title: "Order Error", description: err.message })
      }
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-3xl border-orange-200 shadow-md">
          <CardHeader className="bg-orange-500 text-white h-18 -ml-4 -mt-4 w-[767px]">
            <CardTitle className="text-xl ml-6 pt-6">Place Your Order</CardTitle>
          </CardHeader>
  
          <CardContent className="space-y-6 pt-6">
            {/* Food Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-orange-800">Food Items</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  className="text-orange-700 hover:text-orange-400"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Item
                </Button>
              </div>
  
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-md border border-orange-200 bg-orange-50 p-4 md:grid-cols-12"
                >
                  {/* Food Image */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    {item.image ? (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden border border-orange-200">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.foodName || "Food item"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-orange-100 rounded-md flex items-center justify-center">
                        <span className="text-orange-400 text-xs text-center">No image</span>
                      </div>
                    )}
                  </div>
  
                  <div className="md:col-span-4">
                    <Label htmlFor={`food-${index}`} className="text-orange-700">
                      Food Item
                    </Label>
                    <select
                      id={`food-${index}`}
                      value={item.foodId}
                      onChange={(e) => updateItem(index, "foodId", e.target.value)}
                      className="mt-1 w-full rounded-md border border-orange-200 bg-white p-2 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select a food item</option>
                      {mockFoodItems.map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div className="md:col-span-2">
                    <Label htmlFor={`quantity-${index}`} className="text-orange-700">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
  
                  <div className="md:col-span-3">
                    <Label className="text-orange-700">Price</Label>
                    <div className="mt-1 rounded-md border border-orange-200 bg-white p-2 text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
  
                  <div className="flex items-end md:col-span-1">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="ghost"
                      className="h-10 w-10 p-0 text-orange-700 hover:bg-orange-100 hover:text-orange-900"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Total Amount */}
            <div className="rounded-md bg-orange-100 p-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium text-orange-800">Total Amount</h3>
                <span className="text-lg font-bold text-orange-800">${calculateTotal()}</span>
              </div>
            </div>
  
            {/* Delivery Address */}
            <div>
              <Label htmlFor="address" className="text-orange-700">
                Delivery Address
              </Label>
              <Textarea
                id="address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-1 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your full delivery address"
                required
              />
            </div>
  
            {/* Payment Method */}
            <div>
              <Label className="text-orange-700">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="cod" value="Cash" name="payment" className="border-orange-400 text-orange-600" />
                  <Label htmlFor="cod" className="cursor-pointer">
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="card" value="Card" name="payment" className="border-orange-400 text-orange-600" />
                  <Label htmlFor="card" className="cursor-pointer">
                    Card
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
  
          <div className="flex justify-end gap-x-4 px-6 py-4">
          <Button type="button" className="w-25 bg-red-600 text-white hover:bg-red-500 h-10">
              Cancel
            </Button>
            <Button type="submit" className="w-35 -mr-6 bg-green-600 text-white hover:bg-green-500 h-10">
              Checkout
            </Button>
            
          </div>
        </Card>
      </form>
    )
  }
  