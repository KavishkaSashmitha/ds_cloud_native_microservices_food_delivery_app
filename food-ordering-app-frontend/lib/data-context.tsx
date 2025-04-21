"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  id: string;
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
  preparationTime: string;
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

interface RestaurantContextType {
  restaurant: RestaurantProfile | null;
  menu: MenuItem[];
  categories: Category[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateRestaurantProfile: (data: Partial<RestaurantProfile>) => Promise<void>;
  refreshData: () => void;
}

// Create the context with default values
const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  menu: [],
  categories: [],
  orders: [],
  loading: true,
  error: null,
  addMenuItem: async () => {},
  updateMenuItem: async () => {},
  deleteMenuItem: async () => {},
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  updateOrder: async () => {},
  updateOrderStatus: async () => {},
  updateRestaurantProfile: async () => {},
  refreshData: () => {},
});

// Provider component
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = generateRestaurantData();
      setRestaurant(data.profile);
      setMenu(data.menuItems);
      setCategories(data.categories);
      setOrders(data.orders);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const addMenuItem = async (item: MenuItem) => {
    setMenu((prev) => [...prev, item]);
  };

  const updateMenuItem = async (id: string, data: Partial<MenuItem>) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const deleteMenuItem = async (id: string) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  const addCategory = async (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...data } : cat))
    );
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setMenu((prev) => prev.filter((item) => item.category !== id));
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...data } : order))
    );
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const updateRestaurantProfile = async (data: Partial<RestaurantProfile>) => {
    setRestaurant((prev) => (prev ? { ...prev, ...data } : null));
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateRestaurantData();
      setRestaurant(data.profile);
      setMenu(data.menuItems);
      setCategories(data.categories);
      setOrders(data.orders);
      setLoading(false);
    }, 500);
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        menu,
        categories,
        orders,
        loading,
        error,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrder,
        updateOrderStatus,
        updateRestaurantProfile,
        refreshData,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

// Custom hook to use the restaurant context
export function useRestaurantData() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error(
      "useRestaurantData must be used within a RestaurantProvider"
    );
  }
  return context;
}
