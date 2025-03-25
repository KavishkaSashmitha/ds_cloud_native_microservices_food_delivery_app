import Link from "next/link";
import { ChevronRight, Search, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RestaurantCard } from "./components/restaurant-card";
import { CategoryPill } from "./components/category-pill";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="text-xl font-bold">FoodCloud</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-muted py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Delicious Food Delivered to Your Door
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Order from your favorite local restaurants with just a few
                    taps. Fast delivery, easy payment, and a wide selection of
                    cuisines.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Enter your delivery address"
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                      />
                    </div>
                  </div>
                  <Button type="submit">Find Restaurants</Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Hero Image"
                  width={550}
                  height={550}
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Popular Categories
              </h2>
              <Link
                href="/categories"
                className="flex items-center text-sm font-medium text-primary"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
              <CategoryPill name="Pizza" icon="pizza" />
              <CategoryPill name="Burgers" icon="burger" />
              <CategoryPill name="Sushi" icon="fish" />
              <CategoryPill name="Chinese" icon="soup" />
              <CategoryPill name="Italian" icon="utensils" />
              <CategoryPill name="Mexican" icon="chili-hot" />
              <CategoryPill name="Dessert" icon="cake" />
              <CategoryPill name="Drinks" icon="coffee" />
            </div>
          </div>
        </section>
        <section className="py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Restaurants
              </h2>
              <Link
                href="/restaurants"
                className="flex items-center text-sm font-medium text-primary"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <RestaurantCard
                name="Pizza Palace"
                image="/placeholder.svg?height=200&width=300"
                cuisine="Italian"
                rating={4.8}
                deliveryTime="15-25 min"
                deliveryFee="$1.99"
              />
              <RestaurantCard
                name="Burger Barn"
                image="/placeholder.svg?height=200&width=300"
                cuisine="American"
                rating={4.6}
                deliveryTime="20-30 min"
                deliveryFee="$2.49"
              />
              <RestaurantCard
                name="Sushi Spot"
                image="/placeholder.svg?height=200&width=300"
                cuisine="Japanese"
                rating={4.9}
                deliveryTime="25-35 min"
                deliveryFee="$3.99"
              />
              <RestaurantCard
                name="Taco Time"
                image="/placeholder.svg?height=200&width=300"
                cuisine="Mexican"
                rating={4.7}
                deliveryTime="15-25 min"
                deliveryFee="$1.49"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span className="text-xl font-bold">FoodCloud</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Delicious food delivered to your door
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Company</h3>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Careers
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Press
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Help</h3>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Legal</h3>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cookies
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Connect</h3>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Instagram
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Facebook
              </Link>
            </div>
          </div>
        </div>
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FoodCloud. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
