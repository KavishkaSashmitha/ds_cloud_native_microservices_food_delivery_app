"use client";

import { createContext, useContext } from "react";

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface RestaurantProfile {
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
  businessHours: BusinessHour[];
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: number;
  deliveryRadius: number;
}

const defaultProfile: RestaurantProfile = {
  name: "Sample Restaurant",
  description: "A fine dining experience",
  cuisine: "International",
  priceRange: "$$",
  logo: "/placeholder.svg",
  banner: "/placeholder.svg",
  phone: "+1 234 567 8900",
  email: "contact@restaurant.com",
  address: "123 Restaurant St",
  isOpen: true,
  businessHours: [
    { day: "Monday", open: "09:00", close: "22:00", isOpen: true },
    { day: "Tuesday", open: "09:00", close: "22:00", isOpen: true },
    { day: "Wednesday", open: "09:00", close: "22:00", isOpen: true },
    { day: "Thursday", open: "09:00", close: "22:00", isOpen: true },
    { day: "Friday", open: "09:00", close: "23:00", isOpen: true },
    { day: "Saturday", open: "10:00", close: "23:00", isOpen: true },
    { day: "Sunday", open: "10:00", close: "21:00", isOpen: true },
  ],
  deliveryFee: 5,
  minimumOrder: 15,
  preparationTime: 30,
  deliveryRadius: 5,
};

const RestaurantDataContext = createContext<{
  profile: RestaurantProfile;
  updateProfile: (data: RestaurantProfile) => Promise<void>;
}>({
  profile: defaultProfile,
  updateProfile: async () => {},
});

export function useRestaurantData() {
  return useContext(RestaurantDataContext);
}
