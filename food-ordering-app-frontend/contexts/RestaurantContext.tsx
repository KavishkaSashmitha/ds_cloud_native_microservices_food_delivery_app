"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

// Types
export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  cuisineType: string[];
  openingHours: {
    open: string;
    close: string;
  };
  image?: string;
  rating?: number;
  deliveryFee?: number;
  minOrderAmount?: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  restaurantId: string;
  isAvailable: boolean;
  preparationTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  restaurantId: string;
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  deliveryPerson?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
}

// Input types
export interface MenuItemInput {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isAvailable?: boolean;
  preparationTime?: number;
}

export interface RestaurantProfileInput {
  name: string;
  description: string;
  address: string;
  phone: string;
  cuisineType: string[];
  openingHours: {
    open: string;
    close: string;
  };
  image?: string;
  deliveryFee?: number;
  minOrderAmount?: number;
}

export interface CategoryInput {
  name: string;
}

export interface RestaurantContextType {
  restaurant: Restaurant | null;
  menu: MenuItem[];
  categories: Category[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  addMenuItem: (item: MenuItemInput) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItemInput>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addCategory: (category: CategoryInput) => Promise<void>;
  updateCategory: (id: string, category: CategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  updateRestaurantProfile: (profile: RestaurantProfileInput) => Promise<void>;
  refreshData: () => void;
}

// Create context with default values
const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  menu: [],
  categories: [],
  orders: [],
  loading: false,
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

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Provider component
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Create an axios instance with auth token
  const getAuthAxios = () => {
    const token = localStorage.getItem("token");
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  // Fetch initial data
  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();

      // Fetch restaurant profile
      const restaurantRes = await authAxios.get(
        "/api/restaurants/my-restaurant"
      );
      if (restaurantRes.data.success) {
        setRestaurant(restaurantRes.data.data);
        const restaurantId = restaurantRes.data.data._id;

        // Fetch menu items
        const menuRes = await authAxios.get(
          `/api/restaurants/${restaurantId}/menu`
        );
        if (menuRes.data.success) {
          setMenu(menuRes.data.data);
        }

        // Fetch categories
        const categoriesRes = await authAxios.get(
          `/api/restaurants/${restaurantId}/categories`
        );
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }

        // Fetch orders
        const ordersRes = await authAxios.get(
          `/api/restaurants/${restaurantId}/orders`
        );
        if (ordersRes.data.success) {
          setOrders(ordersRes.data.data);
        }
      } else {
        // If new restaurant owner without restaurant profile
        setRestaurant(null);
      }
    } catch (err: any) {
      console.error("Error fetching restaurant data:", err);
      setError(
        err.response?.data?.message || "Failed to fetch restaurant data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when user changes
  useEffect(() => {
    fetchData();

    // Setup WebSocket for real-time updates
    let ws: WebSocket | null = null;

    if (user && restaurant) {
      const token = localStorage.getItem("token");
      ws = new WebSocket(`${API_URL.replace("http", "ws")}/ws?token=${token}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.type === "NEW_ORDER" &&
            data.restaurantId === restaurant._id
          ) {
            // Add new order to the list
            setOrders((prevOrders) => [data.order, ...prevOrders]);
          } else if (
            data.type === "ORDER_STATUS_UPDATED" &&
            data.restaurantId === restaurant._id
          ) {
            // Update order status
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order._id === data.orderId
                  ? { ...order, status: data.status }
                  : order
              )
            );
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    // Cleanup function
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [user, restaurant?._id]);

  // Menu item operations
  const addMenuItem = async (item: MenuItemInput) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.post(
        `/api/restaurants/${restaurant._id}/menu`,
        item
      );

      if (response.data.success) {
        setMenu((prev) => [...prev, response.data.data]);
      } else {
        throw new Error(response.data.message || "Failed to add menu item");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add menu item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMenuItem = async (id: string, item: Partial<MenuItemInput>) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put(
        `/api/restaurants/${restaurant._id}/menu/${id}`,
        item
      );

      if (response.data.success) {
        setMenu((prev) =>
          prev.map((menuItem) =>
            menuItem._id === id
              ? { ...menuItem, ...response.data.data }
              : menuItem
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to update menu item");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update menu item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.delete(
        `/api/restaurants/${restaurant._id}/menu/${id}`
      );

      if (response.data.success) {
        setMenu((prev) => prev.filter((item) => item._id !== id));
      } else {
        throw new Error(response.data.message || "Failed to delete menu item");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete menu item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Category operations
  const addCategory = async (category: CategoryInput) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.post(
        `/api/restaurants/${restaurant._id}/categories`,
        category
      );

      if (response.data.success) {
        setCategories((prev) => [...prev, response.data.data]);
      } else {
        throw new Error(response.data.message || "Failed to add category");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, category: CategoryInput) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put(
        `/api/restaurants/${restaurant._id}/categories/${id}`,
        category
      );

      if (response.data.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === id ? { ...cat, ...response.data.data } : cat
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to update category");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.delete(
        `/api/restaurants/${restaurant._id}/categories/${id}`
      );

      if (response.data.success) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      } else {
        throw new Error(response.data.message || "Failed to delete category");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Order operations
  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put(`/api/orders/${id}`, orderData);

      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, ...response.data.data } : order
          )
        );
      } else {
        throw new Error(response.data.message || "Failed to update order");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    if (!restaurant) throw new Error("Restaurant profile not found");

    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put(`/api/orders/${id}/status`, {
        status,
      });

      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === id ? { ...order, status } : order))
        );
      } else {
        throw new Error(
          response.data.message || "Failed to update order status"
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update order status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Restaurant profile operations
  const updateRestaurantProfile = async (profile: RestaurantProfileInput) => {
    setLoading(true);
    setError(null);
    try {
      const authAxios = getAuthAxios();

      let response;
      if (restaurant) {
        // Update existing restaurant
        response = await authAxios.put(
          `/api/restaurants/${restaurant._id}`,
          profile
        );
      } else {
        // Create new restaurant
        response = await authAxios.post("/api/restaurants", profile);
      }

      if (response.data.success) {
        setRestaurant(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to update restaurant profile"
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update restaurant profile"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshData = () => {
    fetchData();
  };

  const contextValue = {
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
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Custom hook to use the restaurant context
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
