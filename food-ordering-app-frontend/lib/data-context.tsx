"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  generateRestaurantData,
  type OrderStatus,
} from "./dummy-data-generator";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  popular: boolean;
  options: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

export interface RestaurantProfile {
  id: string; // Add this field
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  address: string;
  isOpen: boolean;
  businessHours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: string; // Change from number to string
  deliveryRadius: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  contactNumber: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface RestaurantDataContextType {
  profile: RestaurantProfile;
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  loading: boolean;
  // Methods for updating data
  updateProfile: (data: Partial<RestaurantProfile>) => Promise<void>;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  refreshData: () => void;
}

// Create the context
const RestaurantContext = createContext<RestaurantDataContextType | undefined>(
  undefined
);

// Provider component
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{
    profile: RestaurantProfile;
    categories: Category[];
    menuItems: MenuItem[];
    orders: Order[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setData(generateRestaurantData());
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Methods for updating data
  const updateProfile = async (newProfileData: Partial<RestaurantProfile>) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          ...newProfileData,
        },
      };
    });
  };

  const addCategory = (category: Category) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        categories: [...prev.categories, category],
      };
    });
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === id ? { ...cat, ...categoryData } : cat
        ),
      };
    });
  };

  const deleteCategory = (id: string) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        categories: prev.categories.filter((cat) => cat.id !== id),
        menuItems: prev.menuItems.filter((item) => item.category !== id),
      };
    });
  };

  const addMenuItem = (item: MenuItem) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        menuItems: [...prev.menuItems, item],
      };
    });
  };

  const updateMenuItem = (id: string, itemData: Partial<MenuItem>) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        menuItems: prev.menuItems.map((item) =>
          item.id === id ? { ...item, ...itemData } : item
        ),
      };
    });
  };

  const deleteMenuItem = (id: string) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        menuItems: prev.menuItems.filter((item) => item.id !== id),
      };
    });
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        orders: prev.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
      };
    });
  };

  // Refresh all data (simulate API refresh)
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(generateRestaurantData());
      setLoading(false);
    }, 500);
  };

  // If data is not loaded yet, return a loading state
  if (loading || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading restaurant data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <RestaurantContext.Provider
      value={{
        profile: data.profile,
        categories: data.categories,
        menuItems: data.menuItems,
        orders: data.orders,
        loading,
        updateProfile,
        addCategory,
        updateCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateOrderStatus,
        refreshData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

// Custom hook for using the context
export function useRestaurantData() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error(
      "useRestaurantData must be used within a RestaurantProvider"
    );
  }
  return context;
}
