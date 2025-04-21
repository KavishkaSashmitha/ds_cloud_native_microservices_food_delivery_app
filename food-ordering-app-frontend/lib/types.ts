// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// User Types
export type UserRole = "CUSTOMER" | "RESTAURANT_OWNER" | "DELIVERY_PERSON";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Response Type Definitions
export type LoginResponse = ApiResponse<AuthResponse>;
export type RegisterResponse = ApiResponse<User>;
export type GetUserResponse = ApiResponse<User>;
export type LogoutResponse = ApiResponse<null>;

// Restaurant Types
export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  ownerId: string;
  // Add other properties as needed
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  // Add other properties as needed
}

// Order Types
export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  // Add other properties as needed
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";