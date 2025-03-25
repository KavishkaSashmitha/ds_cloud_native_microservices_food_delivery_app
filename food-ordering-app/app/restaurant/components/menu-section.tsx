import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface MenuSectionProps {
  section: {
    name: string
    items: MenuItem[]
  }
}

export function MenuSection({ section }: MenuSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{section.name}</h2>
      <div className="grid gap-4">
        {section.items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                      <Button size="icon" variant="ghost" className="mt-2">
                        <PlusCircle className="h-5 w-5" />
                        <span className="sr-only">Add to cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block h-24 w-24 overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

