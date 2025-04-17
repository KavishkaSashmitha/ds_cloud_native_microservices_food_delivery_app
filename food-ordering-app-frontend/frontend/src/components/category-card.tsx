import type { ReactNode } from "react"

interface CategoryCardProps {
  icon: ReactNode
  title: string
  count: number
  isActive?: boolean
}

const CategoryCard = ({ icon, title, count, isActive = false }: CategoryCardProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors ${
        isActive ? "bg-green-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="text-gray-800 mb-2">{icon}</div>
      <h3 className="font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{count} Items</p>
    </div>
  )
}

export default CategoryCard
