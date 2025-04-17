"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { getRestaurants, type Restaurant } from "@/lib/api";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300"
            >
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={
                      restaurant.logo || "/placeholder.svg?height=80&width=80"
                    }
                    alt={restaurant.name}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-600">{restaurant.contactNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-600">{restaurant.email}</p>
                  </div>
                </div>

                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="flex items-center justify-center gap-1 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {restaurants.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No restaurants found</p>
          <Link
            href="/add-restaurant"
            className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add Your First Restaurant
          </Link>
        </div>
      )}
    </div>
  );
}
