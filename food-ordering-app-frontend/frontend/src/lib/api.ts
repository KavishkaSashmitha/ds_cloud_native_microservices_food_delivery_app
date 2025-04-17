// Types
export interface Restaurant {
  id: string
  name: string
  address: string
  contactNumber: string
  email: string
  logo: string
  latitude?: number
  longitude?: number
  phone?: string // Add this line
}

export interface Category {
  id: string
  name: string
  icon: string
  itemCount: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVeg: boolean
  discount?: number
  restaurantId: string
}

export interface KitchenOrder {
  id: string
  itemCount: number
  kitchen: string
  status: string
}

// Mock API functions
export async function getRestaurants(): Promise<Restaurant[]> {
  // In a real app, this would be a fetch call to your API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "rest1",
          name: "CHILI POS Restaurant",
          address: "123 Main St, New York, NY",
          contactNumber: "123-456-7890",
          email: "info@chilipos.com",
          logo: "/placeholder.svg?height=100&width=100",
          latitude: 40.7128,
          longitude: -74.006,
        },
        {
          id: "rest2",
          name: "Burger Palace",
          address: "456 Oak Ave, Los Angeles, CA",
          contactNumber: "987-654-3210",
          email: "info@burgerpalace.com",
          logo: "/placeholder.svg?height=100&width=100",
          latitude: 34.0522,
          longitude: -118.2437,
        },
        {
          id: "rest3",
          name: "Pizza Heaven",
          address: "789 Pine Rd, Chicago, IL",
          contactNumber: "555-123-4567",
          email: "info@pizzaheaven.com",
          logo: "/placeholder.svg?height=100&width=100",
          latitude: 41.8781,
          longitude: -87.6298,
        },
      ])
    }, 500)
  })
}

export async function getCategories(): Promise<Category[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "cat1", name: "All", icon: "grid", itemCount: 235 },
        { id: "cat2", name: "Breakfast", icon: "coffee", itemCount: 19 },
        { id: "cat3", name: "Soups", icon: "soup", itemCount: 8 },
        { id: "cat4", name: "Pasta", icon: "utensils", itemCount: 14 },
        { id: "cat5", name: "Main Course", icon: "chef-hat", itemCount: 27 },
        { id: "cat6", name: "Burgers", icon: "hamburger", itemCount: 13 },
      ])
    }, 500)
  })
}

export async function getMenuItems(categoryId?: string, restaurantId?: string): Promise<MenuItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = [
        {
          id: "item1",
          name: "Tasty Vegetable Salad Healthy Diet",
          description: "Fresh vegetables with our special dressing",
          price: 17.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat5",
          isVeg: true,
          discount: 20,
          restaurantId: "rest1",
        },
        {
          id: "item2",
          name: "Original Chess Meat Burger With Chips",
          description: "Juicy beef patty with cheese and chips",
          price: 23.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat6",
          isVeg: false,
          discount: 0,
          restaurantId: "rest1",
        },
        {
          id: "item3",
          name: "Tacos Salsa With Chickens Grilled",
          description: "Grilled chicken tacos with fresh salsa",
          price: 14.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat5",
          isVeg: false,
          discount: 0,
          restaurantId: "rest1",
        },
        {
          id: "item4",
          name: "Fresh Orange Juice With Basil Seed",
          description: "Refreshing orange juice with basil seeds",
          price: 8.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat2",
          isVeg: true,
          discount: 0,
          restaurantId: "rest1",
        },
        {
          id: "item5",
          name: "Meat Sushi Maki With Tuna, Ship And Other",
          description: "Assorted sushi with tuna and seafood",
          price: 26.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat5",
          isVeg: false,
          discount: 0,
          restaurantId: "rest1",
        },
        {
          id: "item6",
          name: "Original Chess Burger With French Fries",
          description: "Classic cheeseburger with crispy fries",
          price: 21.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat6",
          isVeg: false,
          discount: 20,
          restaurantId: "rest1",
        },
        // Restaurant 2 items
        {
          id: "item7",
          name: "Double Cheese Burger",
          description: "Double beef patty with extra cheese",
          price: 25.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat6",
          isVeg: false,
          discount: 0,
          restaurantId: "rest2",
        },
        {
          id: "item8",
          name: "Chicken Burger",
          description: "Grilled chicken with special sauce",
          price: 19.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat6",
          isVeg: false,
          discount: 10,
          restaurantId: "rest2",
        },
        // Restaurant 3 items
        {
          id: "item9",
          name: "Margherita Pizza",
          description: "Classic pizza with tomato and mozzarella",
          price: 18.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat5",
          isVeg: true,
          discount: 0,
          restaurantId: "rest3",
        },
        {
          id: "item10",
          name: "Pepperoni Pizza",
          description: "Pizza topped with pepperoni slices",
          price: 20.99,
          image: "/placeholder.svg?height=250&width=400",
          category: "cat5",
          isVeg: false,
          discount: 0,
          restaurantId: "rest3",
        },
      ]

      let filteredItems = [...items]

      if (categoryId && categoryId !== "cat1") {
        filteredItems = filteredItems.filter((item) => item.category === categoryId)
      }

      if (restaurantId) {
        filteredItems = filteredItems.filter((item) => item.restaurantId === restaurantId)
      }

      resolve(filteredItems)
    }, 500)
  })
}

export async function getKitchenOrders(): Promise<KitchenOrder[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
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
      ])
    }, 500)
  })
}

export async function createRestaurant(data: Omit<Restaurant, "id">): Promise<Restaurant> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `rest${Math.floor(Math.random() * 1000)}`,
        ...data,
      })
    }, 500)
  })
}

export async function createMenuItem(data: Omit<MenuItem, "id">): Promise<MenuItem> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `item${Math.floor(Math.random() * 1000)}`,
        ...data,
      })
    }, 500)
  })
}
