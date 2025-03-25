import Link from "next/link"
import { Pizza, Beef, Fish, Soup, Utensils, CherryIcon as ChiliHot, Cake, Coffee } from "lucide-react"
import type { JSX } from "react"

interface CategoryPillProps {
  name: string
  icon: string
}

export function CategoryPill({ name, icon }: CategoryPillProps) {
  const getIcon = (): JSX.Element => {
    const props = { className: "h-4 w-4" }

    switch (icon) {
      case "pizza":
        return <Pizza {...props} />
      case "burger":
        return <Beef {...props} />
      case "fish":
        return <Fish {...props} />
      case "soup":
        return <Soup {...props} />
      case "utensils":
        return <Utensils {...props} />
      case "chili-hot":
        return <ChiliHot {...props} />
      case "cake":
        return <Cake {...props} />
      case "coffee":
        return <Coffee {...props} />
      default:
        return <Utensils {...props} />
    }
  }

  return (
    <Link href={`/category/${name.toLowerCase()}`}>
      <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 transition-colors hover:bg-muted">
        {getIcon()}
        <span className="text-sm font-medium">{name}</span>
      </div>
    </Link>
  )
}

