"use client"

import { useEffect, useState } from "react"
import { Grid, Coffee, Soup, Utensils, ChefHat, SandwichIcon as Hamburger } from "lucide-react"
import SearchBar from "@/components/search-bar"
import CategoryCard from "@/components/category-card"
import MenuItemCard from "@/components/menu-item-card"
import KitchenOrder from "@/components/kitchen-order"

import {
  getCategories,
  getMenuItems,
  getKitchenOrders,
  type Category,
  type MenuItem,
  type KitchenOrder as KitchenOrderType,
} from "@/lib/api"

export interface MenuItemCardProps {
  id: string
  name?: string
  price: number
  image: string
  isVeg: boolean
  discount?: number
  quantity: number
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrderType[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("cat1")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoriesData, menuItemsData, kitchenOrdersData] = await Promise.all([
          getCategories(),
          getMenuItems(),
          getKitchenOrders(),
        ])
        setCategories(categoriesData)
        setMenuItems(menuItemsData)
        setKitchenOrders(kitchenOrdersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId)
    setLoading(true)
    try {
      const items = await getMenuItems(categoryId)
      setMenuItems(items)
    } catch (error) {
      console.error("Error fetching menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "all":
        return <Grid className="w-6 h-6" />
      case "breakfast":
        return <Coffee className="w-6 h-6" />
      case "soups":
        return <Soup className="w-6 h-6" />
      case "pasta":
        return <Utensils className="w-6 h-6" />
      case "main course":
        return <ChefHat className="w-6 h-6" />
      case "burgers":
        return <Hamburger className="w-6 h-6" />
      default:
        return <Grid className="w-6 h-6" />
    }
  }

  return (
    <div className="p-0">
      <div className="mb-6 px-4">
        <SearchBar />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8 px-4">
        {categories.map((category) => (
          <div key={category.id} onClick={() => handleCategoryChange(category.id)}>
            <CategoryCard
              icon={getCategoryIcon(category.name)}
              title={category.name}
              count={category.itemCount}
              isActive={selectedCategory === category.id}
            />
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                name={item.name}
                price={item.price}
                image={item.image}
                isVeg={item.isVeg}
                discount={item.discount}
                quantity={1}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            {kitchenOrders.map((order) => (
              <KitchenOrder
                key={order.id}
                id={order.id}
                itemCount={order.itemCount}
                kitchen={order.kitchen}
                status={order.status}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
