"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  popular: boolean;
  options: string[];
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (available: boolean) => void;
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuItemCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <Image
                src={item.image || "/placeholder.svg?height=80&width=80"}
                alt={item.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-medium">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  {item.popular && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                      Popular
                    </span>
                  )}
                  <Switch
                    checked={item.available}
                    onCheckedChange={onToggleAvailability}
                    aria-label="Toggle availability"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Menu Item Preview</DialogTitle>
            <DialogDescription>
              This is how your item will appear to customers
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative h-40 w-40 overflow-hidden rounded-md">
              <Image
                src={item.image || "/placeholder.svg?height=160&width=160"}
                alt={item.name}
                width={160}
                height={160}
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.category}</p>
              <p className="mt-2">{item.description}</p>
              <p className="mt-2 text-lg font-bold">${item.price.toFixed(2)}</p>

              {item.options.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium">Options:</h4>
                  <ul className="mt-1">
                    {item.options.map((option, index) => (
                      <li key={index} className="text-sm">
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2">
                {item.popular && (
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                    Popular
                  </span>
                )}
                {!item.available && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
