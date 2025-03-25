import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuSection } from "../components/menu-section";
import { RestaurantInfo } from "../components/restaurant-info";

export default function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  // In a real app, you would fetch restaurant data based on the slug
  const restaurant = {
    name: "Pizza Palace",
    slug: params.slug,
    image: "/placeholder.svg?height=300&width=1200",
    cuisine: "Italian",
    rating: 4.8,
    reviewCount: 243,
    address: "123 Main St, Anytown, USA",
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    description:
      "Authentic Italian pizza made with fresh ingredients and baked in a wood-fired oven.",
    menuSections: [
      {
        name: "Popular Items",
        items: [
          {
            id: "1",
            name: "Margherita Pizza",
            description: "Fresh mozzarella, tomato sauce, and basil",
            price: 12.99,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "2",
            name: "Pepperoni Pizza",
            description: "Pepperoni, mozzarella, and tomato sauce",
            price: 14.99,
            image: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
      {
        name: "Pizzas",
        items: [
          {
            id: "3",
            name: "Vegetarian Pizza",
            description:
              "Bell peppers, onions, mushrooms, olives, and mozzarella",
            price: 13.99,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "4",
            name: "Meat Lovers Pizza",
            description: "Pepperoni, sausage, bacon, ham, and mozzarella",
            price: 16.99,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "5",
            name: "Hawaiian Pizza",
            description: "Ham, pineapple, and mozzarella",
            price: 14.99,
            image: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
      {
        name: "Sides",
        items: [
          {
            id: "6",
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter",
            price: 4.99,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "7",
            name: "Caesar Salad",
            description:
              "Romaine lettuce, croutons, parmesan, and Caesar dressing",
            price: 6.99,
            image: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
      {
        name: "Drinks",
        items: [
          {
            id: "8",
            name: "Soda",
            description: "Coke, Diet Coke, Sprite, or Dr. Pepper",
            price: 1.99,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "9",
            name: "Bottled Water",
            description: "16 oz bottle of spring water",
            price: 1.49,
            image: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center gap-4 py-4">
          <Link href="/">
            <Button>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-[200px] w-full overflow-hidden md:h-[300px]">
          <img
            src={restaurant.image || "/placeholder.svg"}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container px-4 py-6 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 lg:gap-12">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h1 className="text-2xl font-bold md:text-3xl">
                  {restaurant.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>
                      {restaurant.rating} ({restaurant.reviewCount} reviews)
                    </span>
                  </div>
                  <div>{restaurant.cuisine}</div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {restaurant.description}
                </p>
              </div>
              <Tabs defaultValue="menu">
                <TabsList className="mb-4">
                  <TabsTrigger value="menu">Menu</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="menu" className="space-y-8">
                  {restaurant.menuSections.map((section) => (
                    <MenuSection key={section.name} section={section} />
                  ))}
                </TabsContent>
                <TabsContent value="reviews">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Reviews coming soon</p>
                  </div>
                </TabsContent>
                <TabsContent value="info">
                  <RestaurantInfo restaurant={restaurant} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="md:col-span-1">
              <div className="sticky top-24 rounded-lg border bg-card p-4 shadow-sm">
                <h2 className="font-semibold">Your Order</h2>
                <div className="mt-4 text-center py-8">
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add items to get started
                  </p>
                </div>
                <Button className="mt-4 w-full" disabled>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
