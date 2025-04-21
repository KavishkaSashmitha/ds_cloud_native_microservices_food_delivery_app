"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { ChevronDown, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile"

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

interface FormData {
  name: string;
  category: string;
  price: number; // Changed from string to number
  description: string;
  available: boolean;
  popular: boolean;
  image: string;
  options: string[];
}

interface MenuItemFormProps {
  categories: Category[];
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function MenuItemForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    price: 0, // Initialize with 0 instead of empty string
    description: "",
    available: true,
    popular: false,
    image: "/placeholder.svg?height=80&width=80",
    options: [],
  });

  const [newOption, setNewOption] = useState("");
  const isMobile = useIsMobile()

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price:
          typeof initialData.price === "string"
            ? parseFloat(initialData.price)
            : initialData.price,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSwitchChange = (field: keyof FormData, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()],
      }));
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      price: formData.price,
    });
  };

  return (
    <>
      <ScrollArea className="max-h-[70vh]">
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                name="name"
                placeholder="e.g., Grilled Salmon"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemCategory">Category</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.category || "Select Category"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() =>
                        setFormData({ ...formData, category: category.name })
                      }
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Price ($)</Label>
              <Input
                id="itemPrice"
                name="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDiscount">
                Discount Price ($) (Optional)
              </Label>
              <Input id="itemDiscount" type="number" placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea
              id="itemDescription"
              name="description"
              placeholder="Describe your menu item"
              value={formData.description}
              onChange={handleChange}
              rows={isMobile ? 3 : 4}
            />
          </div>

          <div className="space-y-2">
            <Label>Item Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                <Image
                  src={formData.image || "/placeholder.svg?height=96&width=96"}
                  alt="Menu item"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <Button variant="outline" type="button">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("available", checked)
                  }
                />
                <Label htmlFor="available">Available for Order</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("popular", checked)
                  }
                />
                <Label htmlFor="popular">Mark as Popular</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Customization Options</Label>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Add customization options
                </span>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Spicy, Extra cheese"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="w-48"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddOption}>
                    <Plus className="h-4 w-4" />
                    <span className={isMobile ? "sr-only" : "ml-1"}>
                    Add
                    </span>
                  </Button>
                </div>
              </div>

              {formData.options.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.options.map((option, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveOption(index)}
                    >
                      {option} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? "Update Item" : "Add Item"}
        </Button>
      </DialogFooter>
    </>
  );
}
