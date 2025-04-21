"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRestaurantData } from "@/lib/data-context";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile"

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

interface NewCategory {
  name: string;
  description: string;
}

export function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useRestaurantData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const isMobile = useIsMobile()

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const category: Category = {
      id: uuidv4(),
      name: newCategory.name,
      description: newCategory.description,
      itemCount: 0,
    };

    addCategory(category);
    setNewCategory({ name: "", description: "" });
    setShowAddDialog(false);

    toast({
      title: "Category Added",
      description: `${category.name} has been added to your menu categories.`,
    });
  };

  const handleEditCategory = () => {
    if (!selectedCategory?.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    updateCategory(selectedCategory.id, {
      name: selectedCategory.name,
      description: selectedCategory.description,
    });

    setShowEditDialog(false);
    setSelectedCategory(null);

    toast({
      title: "Category Updated",
      description: `${selectedCategory.name} has been updated successfully.`,
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    deleteCategory(id);
    toast({
      title: "Category Deleted",
      description: `${name} has been removed from your menu categories.`,
    });
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setShowEditDialog(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Menu Categories</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>
              Add Category
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your menu items
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Appetizers, Desserts"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription">
                  Description (Optional)
                </Label>
                <Textarea
                  id="categoryDescription"
                  placeholder="Brief description of this category"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2 flex items-start justify-between">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditClick(category)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Category
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">{category.itemCount}</span> items
                in this category
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update this menu category</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editCategoryName">Category Name</Label>
                <Input
                  id="editCategoryName"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategoryDescription">
                  Description (Optional)
                </Label>
                <Textarea
                  id="editCategoryDescription"
                  value={selectedCategory.description}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Update Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
