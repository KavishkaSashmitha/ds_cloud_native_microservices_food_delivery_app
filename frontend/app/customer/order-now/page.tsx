"use client";

import { useState } from "react";
import { useCustomer } from "@/contexts/customer-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Minus, Plus, Loader2, MapPin, X } from "lucide-react";

// Mock restaurants
const RESTAURANTS = [
  {
    id: "rest-1",
    name: "Burger Palace",
    address: "123 Main St, Colombo",
    location: { lat: 6.9271, lng: 79.8612 },
  },
  {
    id: "rest-2",
    name: "Pizza Planet",
    address: "456 Park Ave, Colombo",
    location: { lat: 6.9344, lng: 79.8428 },
  },
  {
    id: "rest-3",
    name: "Noodle House",
    address: "789 Food St, Colombo",
    location: { lat: 6.9101, lng: 79.8712 },
  },
];

// Mock menu items
const MENU_ITEMS = {
  "rest-1": [
    { id: "item-1", name: "Cheeseburger", price: 700 },
    { id: "item-2", name: "Double Burger", price: 950 },
    { id: "item-3", name: "Chicken Burger", price: 800 },
    { id: "item-4", name: "Fries", price: 450 },
    { id: "item-5", name: "Soft Drink", price: 250 },
  ],
  "rest-2": [
    { id: "item-6", name: "Pepperoni Pizza", price: 1500 },
    { id: "item-7", name: "Vegetarian Pizza", price: 1300 },
    { id: "item-8", name: "Garlic Bread", price: 600 },
    { id: "item-9", name: "Pasta", price: 950 },
  ],
  "rest-3": [
    { id: "item-10", name: "Pad Thai", price: 950 },
    { id: "item-11", name: "Spring Rolls", price: 450 },
    { id: "item-12", name: "Fried Rice", price: 750 },
    { id: "item-13", name: "Wonton Soup", price: 500 },
  ],
};

// Mock addresses
const ADDRESSES = [
  {
    id: "addr-1",
    address: "123 Customer St, Colombo",
    location: { lat: 6.9271, lng: 79.8612 },
  },
  {
    id: "addr-2",
    address: "456 Delivery Rd, Colombo",
    location: { lat: 6.9344, lng: 79.8528 },
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderNowPage() {
  const { placeOrder, isLoading } = useCustomer();
  const { toast } = useToast();

  // State for order form
  const [restaurantId, setRestaurantId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Selected restaurant and menu
  const selectedRestaurant = RESTAURANTS.find((r) => r.id === restaurantId);
  const menuItems = restaurantId
    ? MENU_ITEMS[restaurantId as keyof typeof MENU_ITEMS]
    : [];
  const selectedAddress = ADDRESSES.find((a) => a.id === addressId);

  // Calculate total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 150 : 0;
  const total = subtotal + deliveryFee;

  // Add item to cart
  const addToCart = (item: { id: string; name: string; price: number }) => {
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      // Update quantity if item already in cart
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    toast({
      description: `Added ${item.name} to cart`,
      duration: 1500,
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, change: number) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart(cart.filter((i) => i.id !== itemId));
    } else {
      // Update item quantity
      setCart(
        cart.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
      );
    }
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCart(cart.filter((i) => i.id !== itemId));
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!restaurantId) {
      toast({
        title: "Restaurant Required",
        description: "Please select a restaurant",
        variant: "destructive",
      });
      return;
    }

    if (!addressId) {
      toast({
        title: "Address Required",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await placeOrder({
        restaurantId,
        restaurantName: selectedRestaurant?.name || "",
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        total,
        customerAddress: selectedAddress?.address || "",
        customerLocation: selectedAddress?.location || { lat: 0, lng: 0 },
      });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Place an Order</h1>
        <p className="text-gray-600">Order food for immediate delivery</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - Restaurant & Menu */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select a Restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={restaurantId} onValueChange={setRestaurantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {RESTAURANTS.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRestaurant && (
                <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedRestaurant.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {restaurantId && (
            <Card>
              <CardHeader>
                <CardTitle>Menu</CardTitle>
                <CardDescription>
                  Select items to add to your cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Rs. {item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Cart & Checkout */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
              <CardDescription>
                Review your cart before ordering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 my-10">
                  Your cart is empty
                </p>
              ) : (
                <>
                  {/* Cart items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Rs. {item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-1 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery fee</span>
                      <span>Rs. {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t mt-1">
                      <span>Total</span>
                      <span>Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Delivery address */}
              <div className="pt-4 border-t">
                <Label htmlFor="address">Delivery Address</Label>
                <Select value={addressId} onValueChange={setAddressId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose an address" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDRESSES.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Order notes */}
              <div className="pt-4">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea
                  id="notes"
                  className="mt-1"
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={
                  cart.length === 0 || !restaurantId || !addressId || isLoading
                }
                onClick={handleSubmitOrder}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Placing Order..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
