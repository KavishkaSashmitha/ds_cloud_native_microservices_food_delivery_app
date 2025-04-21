"use client";

import { useState } from "react";
import { ChevronDown, FilePlus, FolderPlus, Plus, Search } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useRestaurantData } from "@/lib/data-context";
import { toast } from "@/components/ui/use-toast";
import { MenuItemCard } from "@/components/menu-item-card";
import { MenuItemForm } from "@/components/menu-item-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useIsMobile } from "@/hooks/use-mobile"

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

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

export default function MenuManagement() {
  const {
    categories,
    menuItems,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useRestaurantData();

  const [activeTab, setActiveTab] = useState("all");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const isMobile = useIsMobile()

  // Form states
  const [newCategory, setNewCategory] = useState<
    Omit<Category, "id" | "itemCount">
  >({
    name: "",
    description: "",
  });

  // Filter and sort menu items
  const filteredItems = menuItems
    .filter((item) => {
      // Filter by category if not "all"
      if (
        activeTab !== "all" &&
        item.category.toLowerCase() !== activeTab.toLowerCase()
      ) {
        return false;
      }

      // Filter by search query
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a: MenuItem, b: MenuItem) => {
      switch (sortOrder) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "popular":
          return Number(b.popular) - Number(a.popular);
        default: // newest
          return 0; // In a real app, would use creation date
      }
    });

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const category = {
      id: uuidv4(),
      name: newCategory.name,
      description: newCategory.description,
      itemCount: 0,
    };

    addCategory(category);
    setNewCategory({ name: "", description: "" });
    setShowAddCategoryDialog(false);

    toast({
      title: "Category Added",
      description: `${category.name} has been added to your menu categories.`,
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowEditItemDialog(true);
  };

  const handleDeleteMenuItem = (id: string, name: string) => {
    deleteMenuItem(id);
    toast({
      title: "Menu Item Deleted",
      description: `${name} has been removed from your menu.`,
    });
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    updateMenuItem(id, { available });
    toast({
      title: available ? "Item Available" : "Item Unavailable",
      description: `The menu item is now ${
        available ? "available" : "unavailable"
      } for ordering.`,
    });
  };

  return (
     <DashboardLayout>
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Menu Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage your restaurant's menu items and categories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog
              open={showAddCategoryDialog}
              onOpenChange={setShowAddCategoryDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
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
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCategoryDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showAddItemDialog}
              onOpenChange={setShowAddItemDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>
                  Add Menu Item
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>
                    Create a new item for your restaurant menu
                  </DialogDescription>
                </DialogHeader>
                <MenuItemForm
                  categories={categories}
                  onSubmit={(item) => {
                    addMenuItem({
                      id: uuidv4(),
                      ...item,
                    });
                    setShowAddItemDialog(false);
                    toast({
                      title: "Menu Item Added",
                      description: `${item.name} has been added to your menu.`,
                    });
                  }}
                  onCancel={() => setShowAddItemDialog(false)}
                />
              </DialogContent>
            </Dialog>

            {selectedItem && (
              <Dialog
                open={showEditItemDialog}
                onOpenChange={setShowEditItemDialog}
              >
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Menu Item</DialogTitle>
                    <DialogDescription>
                      Update details for this menu item
                    </DialogDescription>
                  </DialogHeader>
                  <MenuItemForm
                    categories={categories}
                    initialData={
                      selectedItem
                        ? { ...selectedItem, image: selectedItem.image || "" }
                        : undefined
                    }
                    onSubmit={(item) => {
                      updateMenuItem(selectedItem.id, item);
                      setShowEditItemDialog(false);
                      setSelectedItem(null);
                      toast({
                        title: "Menu Item Updated",
                        description: `${item.name} has been updated successfully.`,
                      });
                    }}
                    onCancel={() => {
                      setShowEditItemDialog(false);
                      setSelectedItem(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu items..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by:{" "}
                {sortOrder === "newest"
                  ? "Newest"
                  : sortOrder === "name-asc"
                  ? "Name (A-Z)"
                  : sortOrder === "name-desc"
                  ? "Name (Z-A)"
                  : sortOrder === "price-asc"
                  ? "Price (Low to High)"
                  : sortOrder === "price-desc"
                  ? "Price (High to Low)"
                  : "Most Popular"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("name-asc")}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("name-desc")}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("price-asc")}>
                Price (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("price-desc")}>
                Price (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("popular")}>
                Most Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full overflow-x-auto">
            <TabsTrigger value="all">
              All Items ({menuItems.length})
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.name.toLowerCase()}
              >
                {category.name} (
                {
                  menuItems.filter((item) => item.category === category.name)
                    .length
                }
                )
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredItems.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground">No menu items found</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowAddItemDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Item
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteMenuItem(item.id, item.name)}
                    onToggleAvailability={(available) =>
                      handleToggleAvailability(item.id, available)
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
}
