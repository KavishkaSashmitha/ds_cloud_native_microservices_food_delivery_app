import { faker } from "@faker-js/faker"

// Restaurant Profile Data
export function generateRestaurantProfile() {
  return {
    id: faker.string.uuid(),
    name: faker.company.name() + " Restaurant",
    description: faker.company.catchPhrase() + ". " + faker.company.buzzPhrase(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address:
      faker.location.streetAddress() +
      ", " +
      faker.location.city() +
      ", " +
      faker.location.state() +
      " " +
      faker.location.zipCode(),
    cuisine: faker.helpers.arrayElement([
      "Italian",
      "Chinese",
      "Mexican",
      "Indian",
      "American",
      "Japanese",
      "Thai",
      "Mediterranean",
      "French",
      "Greek",
    ]),
    priceRange: faker.helpers.arrayElement(["$", "$$", "$$$", "$$$$"]),
    deliveryFee: faker.number.float({ min: 1.99, max: 6.99, precision: 0.01 }),
    minimumOrder: faker.number.float({ min: 10, max: 25, precision: 0.01 }),
    preparationTime: faker.helpers.arrayElement(["15-25", "20-30", "25-35", "30-40", "35-45"]),
    isOpen: faker.datatype.boolean(0.8),
    logo: "/placeholder.svg?height=80&width=80",
    banner: "/placeholder.svg?height=160&width=400",
    businessHours: [
      { day: "Monday", open: "09:00", close: "22:00", isOpen: true },
      { day: "Tuesday", open: "09:00", close: "22:00", isOpen: true },
      { day: "Wednesday", open: "09:00", close: "22:00", isOpen: true },
      { day: "Thursday", open: "09:00", close: "22:00", isOpen: true },
      { day: "Friday", open: "09:00", close: "23:00", isOpen: true },
      { day: "Saturday", open: "10:00", close: "23:00", isOpen: true },
      { day: "Sunday", open: "10:00", close: "21:00", isOpen: faker.datatype.boolean(0.5) },
    ],
    deliveryRadius: faker.number.int({ min: 3, max: 10 }),
  }
}

// Menu Categories
export function generateMenuCategories(count = 5) {
  const categories = [
    "Appetizers",
    "Main Courses",
    "Desserts",
    "Beverages",
    "Specials",
    "Salads",
    "Soups",
    "Sides",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Vegan",
    "Vegetarian",
    "Gluten-Free",
    "Kids Menu",
  ]

  return faker.helpers
    .shuffle(categories)
    .slice(0, count)
    .map((name, index) => ({
      id: faker.string.uuid(),
      name,
      itemCount: faker.number.int({ min: 3, max: 15 }),
      description: faker.commerce.productDescription(),
    }))
}

// Menu Items
export function generateMenuItem(categoryName: string) {
  const popular = faker.datatype.boolean(0.3)
  const available = faker.datatype.boolean(0.9)

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: categoryName,
    price: faker.number.float({ min: 4.99, max: 29.99, precision: 0.01 }),
    description: faker.commerce.productDescription(),
    available,
    popular,
    image: `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(faker.commerce.productName())}`,
    options: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () =>
      faker.helpers.arrayElement([
        "Spicy",
        "Extra cheese",
        "Gluten-free",
        "Vegan option",
        "No onions",
        "No garlic",
        "Extra sauce",
        "Well done",
        "Medium rare",
      ]),
    ),
  }
}

export function generateMenuItems(categories: any[], itemsPerCategory = { min: 3, max: 8 }) {
  return categories.flatMap((category) => {
    const count = faker.number.int({ min: itemsPerCategory.min, max: itemsPerCategory.max })
    return Array.from({ length: count }, () => generateMenuItem(category.name))
  })
}

// Order Status Types
export type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled"

// Generate a single order item
function generateOrderItem(menuItems: any[]) {
  const item = faker.helpers.arrayElement(menuItems)
  const quantity = faker.number.int({ min: 1, max: 3 })

  return {
    name: item.name,
    quantity,
    price: item.price,
    options:
      item.options.length > 0
        ? faker.helpers.arrayElements(item.options, faker.number.int({ min: 0, max: item.options.length }))
        : [],
    subtotal: item.price * quantity,
  }
}

// Generate a single order
export function generateOrder(menuItems: any[], status?: OrderStatus) {
  const orderStatus: OrderStatus =
    status || (faker.helpers.arrayElement(["new", "new", "preparing", "ready", "completed"]) as OrderStatus)

  const itemCount = faker.number.int({ min: 1, max: 5 })
  const items = Array.from({ length: itemCount }, () => generateOrderItem(menuItems))
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const deliveryFee = faker.number.float({ min: 2.99, max: 5.99, precision: 0.01 })
  const total = subtotal + deliveryFee

  // Time based on status
  let timeAgo: string
  switch (orderStatus) {
    case "new":
      timeAgo = faker.helpers.arrayElement(["Just now", "1 min ago", "2 min ago", "5 min ago"])
      break
    case "preparing":
      timeAgo = faker.helpers.arrayElement(["10 min ago", "15 min ago", "20 min ago"])
      break
    case "ready":
      timeAgo = faker.helpers.arrayElement(["25 min ago", "30 min ago", "35 min ago"])
      break
    case "completed":
      timeAgo = faker.helpers.arrayElement(["1 hour ago", "2 hours ago", "Yesterday"])
      break
    default:
      timeAgo = faker.helpers.arrayElement(["Just now", "5 min ago", "10 min ago"])
  }

  return {
    id: `ORD-${faker.number.int({ min: 1000, max: 9999 })}`,
    customer: faker.person.fullName(),
    items,
    subtotal,
    deliveryFee,
    total,
    status: orderStatus,
    time: timeAgo,
    address:
      faker.location.streetAddress() +
      ", " +
      faker.location.city() +
      ", " +
      faker.location.state() +
      " " +
      faker.location.zipCode(),
    phone: faker.phone.number(),
    paymentMethod: faker.helpers.arrayElement(["Credit Card", "PayPal", "Cash on Delivery", "Apple Pay"]),
    deliveryTime: faker.helpers.arrayElement(["15-25 min", "20-30 min", "25-35 min", "30-40 min"]),
    notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : "",
    createdAt: new Date(Date.now() - faker.number.int({ min: 5, max: 120 }) * 60000),
  }
}

// Generate multiple orders
export function generateOrders(menuItems: any[], count = 10, distribution?: Record<OrderStatus, number>) {
  if (distribution) {
    const orders: any[] = []

    // Generate orders based on the specified distribution
    Object.entries(distribution).forEach(([status, count]) => {
      for (let i = 0; i < count; i++) {
        orders.push(generateOrder(menuItems, status as OrderStatus))
      }
    })

    return orders
  }

  // Default distribution if none specified
  return Array.from({ length: count }, () => generateOrder(menuItems))
}

// Generate all data needed for the restaurant management system
export function generateRestaurantData() {
  const profile = generateRestaurantProfile()
  const categories = generateMenuCategories()
  const menuItems = generateMenuItems(categories)
  const orders = generateOrders(menuItems, 15, {
    new: 5,
    preparing: 4,
    ready: 3,
    completed: 2,
    cancelled: 1,
  })

  return {
    profile,
    categories,
    menuItems,
    orders,
  }
}
