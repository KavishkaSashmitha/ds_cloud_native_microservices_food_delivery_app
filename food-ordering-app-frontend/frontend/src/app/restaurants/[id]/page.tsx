"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Grid,
  Coffee,
  Soup,
  Utensils,
  ChefHat,
  SandwichIcon as Hamburger,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import {
  getRestaurants,
  getCategories,
  getMenuItems,
  type Restaurant,
  type Category,
  type MenuItem,
} from "@/lib/api";
import CategoryCard from "@/components/category-card";
import { useCart } from "@/lib/cart-context";
import MapComponent from "@/components/map-component";

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("cat1");
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch restaurant details
        const restaurants = await getRestaurants();
        const currentRestaurant = restaurants.find(
          (r) => r.id === restaurantId
        );

        if (!currentRestaurant) {
          router.push("/restaurants");
          return;
        }

        setRestaurant(currentRestaurant);

        // Fetch categories and menu items for this restaurant
        const [categoriesData, menuItemsData] = await Promise.all([
          getCategories(),
          getMenuItems(undefined, restaurantId),
        ]);

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId, router]);

  // Add this to the existing useEffect in the restaurant detail page
  useEffect(() => {
    // Check if the URL has a map parameter
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("map") === "true") {
        setShowMap(true);
      }
    }
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    try {
      const items = await getMenuItems(categoryId, restaurantId);
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "all":
        return <Grid className="w-6 h-6" />;
      case "breakfast":
        return <Coffee className="w-6 h-6" />;
      case "soups":
        return <Soup className="w-6 h-6" />;
      case "pasta":
        return <Utensils className="w-6 h-6" />;
      case "main course":
        return <ChefHat className="w-6 h-6" />;
      case "burgers":
        return <Hamburger className="w-6 h-6" />;
      default:
        return <Grid className="w-6 h-6" />;
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurantId,
      restaurantName: restaurant?.name || "",
      quantity: 1,
    });
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  if (loading && !restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Restaurant not found</p>
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const hasLocation =
    restaurant.latitude !== undefined && restaurant.longitude !== undefined;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-green-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Restaurants
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Image
              src={restaurant.logo || "/placeholder.svg?height=80&width=80"}
              alt={restaurant.name}
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-600">{restaurant.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-600">{restaurant.email}</p>
                </div>
              </div>
            </div>
            {hasLocation && (
              <button
                onClick={toggleMap}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{showMap ? "Hide Map" : "Show Map"}</span>
              </button>
            )}
          </div>

          {/* Map Section */}
          {showMap && hasLocation && (
            <div className="mt-6 animate-fadeIn">
              <MapComponent
                latitude={restaurant.latitude}
                longitude={restaurant.longitude}
                height="300px"
                zoom={15}
                readOnly={true}
              />
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Menu</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
          >
            <CategoryCard
              icon={getCategoryIcon(category.name)}
              title={category.name}
              count={category.itemCount}
              isActive={selectedCategory === category.id}
            />
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-300 flex flex-col"
            >
              <div className="relative">
                {(item.discount ?? 0) > 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-md text-sm">
                    {item.discount}% Off
                  </div>
                )}
                <Image
                  src={item.image || "/placeholder.svg?height=250&width=400"}
                  alt={item.name}
                  width={400}
                  height={250}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xl font-semibold text-green-600">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-500">
                        {item.isVeg ? "Veg" : "Non Veg"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {menuItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No menu items found for this restaurant
          </p>
        </div>
      )}
    </div>
  );
}
