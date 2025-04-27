"use client";

import type React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
}

interface AddFoodItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
  categories: Category[];
}

export function AddFoodItemDialog({
  isOpen,
  onClose,
  onAdd,
  categories,
}: AddFoodItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    preparationTime: 15, // Default preparation time in minutes
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only valid numbers
    if (!isNaN(Number(value))) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      price: Number.parseFloat(formData.price),
      preparationTime: Number.parseInt(formData.preparationTime.toString()),
    });
    // Reset form
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      preparationTime: 15,
      featured: false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Create a new food item for your restaurant menu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Chicken Burger"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your food item..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="9.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="preparationTime">
                Preparation Time (minutes)
              </Label>
              <Input
                id="preparationTime"
                name="preparationTime"
                type="number"
                min="1"
                max="120"
                value={formData.preparationTime}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="mt-2 space-y-2">
              <Label>Dietary Information</Label>
              <div className="flex flex-col gap-3 rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVegetarian"
                    checked={formData.isVegetarian}
                    onCheckedChange={handleCheckboxChange("isVegetarian")}
                  />
                  <Label htmlFor="isVegetarian" className="font-normal">
                    Vegetarian
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVegan"
                    checked={formData.isVegan}
                    onCheckedChange={handleCheckboxChange("isVegan")}
                  />
                  <Label htmlFor="isVegan" className="font-normal">
                    Vegan
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isGlutenFree"
                    checked={formData.isGlutenFree}
                    onCheckedChange={handleCheckboxChange("isGlutenFree")}
                  />
                  <Label htmlFor="isGlutenFree" className="font-normal">
                    Gluten Free
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={handleSwitchChange("available")}
              />
              <Label htmlFor="available">Available for ordering</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleSwitchChange("featured")}
              />
              <Label htmlFor="featured">
                Featured item (shown prominently on menu)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
