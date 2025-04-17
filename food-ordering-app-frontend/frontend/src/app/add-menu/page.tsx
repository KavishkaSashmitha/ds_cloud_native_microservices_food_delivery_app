"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createMenuItem,
  getRestaurants,
  getCategories,
  type Restaurant,
  type Category,
} from "@/lib/api";
import {
  UtensilsCrossed,
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Percent,
  Tag,
  Store,
} from "lucide-react";

export default function AddMenu() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "/placeholder.svg?height=250&width=400", // Default placeholder
    category: "",
    isVeg: false,
    discount: 0,
    restaurantId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsData, categoriesData] = await Promise.all([
          getRestaurants(),
          getCategories(),
        ]);
        setRestaurants(restaurantsData);
        setCategories(categoriesData);

        // Set default values if data exists
        if (restaurantsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            restaurantId: restaurantsData[0].id,
          }));
        }

        if (categoriesData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: categoriesData[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Failed to load restaurants and categories. Please refresh the page."
        );
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // In a real app, this would upload the file to a server
  // For this demo, we'll just use a placeholder with a random ID to simulate a change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload by using a different placeholder
      const randomId = Math.floor(Math.random() * 1000);
      setFormData((prev) => ({
        ...prev,
        image: `/placeholder.svg?height=400&width=600&text=Food+Image+${randomId}`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createMenuItem(formData);
      setSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/restaurants");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error creating menu item:", error);
      setError("Failed to create menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset success state when component unmounts
  useEffect(() => {
    return () => {
      setSuccess(false);
    };
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-green-600 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <UtensilsCrossed className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add New Menu Item</h1>
            <p className="text-gray-500 mt-1">
              Create a new dish to add to your restaurant's menu.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700">
            Menu item created successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="col-span-1">
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Item Image
                </label>
                <p className="text-xs text-gray-500">
                  Upload an appetizing image of your dish. Recommended size:
                  600x400px.
                </p>
              </div>

              <div
                onClick={handleImageClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
              >
                <Image
                  src={formData.image || "/placeholder.svg"}
                  alt="Menu Item"
                  width={200}
                  height={150}
                  className="rounded-lg mb-4 object-cover w-full h-[150px]"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Or enter image URL
                </label>
                <input
                  id="image"
                  name="image"
                  type="text"
                  value={formData.image}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Vegetarian Toggle */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <input
                    id="isVeg"
                    name="isVeg"
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isVeg"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Vegetarian
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mark this dish as vegetarian if it contains no meat or fish
                  products.
                </p>
              </div>
            </div>

            {/* Menu Item Details */}
            <div className="col-span-2 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter dish name"
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the dish, ingredients, and flavors"
                    rows={3}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Discount (%)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Percent className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="discount"
                        name="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="restaurantId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Restaurant <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="restaurantId"
                        name="restaurantId"
                        required
                        value={formData.restaurantId}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {restaurants.map((restaurant) => (
                          <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              {formData.name && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <div className="relative">
                      {formData.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-black font-medium px-2 py-1 rounded-md text-sm">
                          {formData.discount}% Off
                        </div>
                      )}
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt={formData.name}
                        width={400}
                        height={200}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{formData.name}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {formData.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-lg font-semibold text-green-600">
                          ${formData.price.toFixed(2)}
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              formData.isVeg ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          <span className="text-sm text-gray-500">
                            {formData.isVeg ? "Veg" : "Non Veg"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {getCategoryName(formData.category)} •{" "}
                        {
                          restaurants.find(
                            (r) => r.id === formData.restaurantId
                          )?.name
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t  border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Menu Item</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
