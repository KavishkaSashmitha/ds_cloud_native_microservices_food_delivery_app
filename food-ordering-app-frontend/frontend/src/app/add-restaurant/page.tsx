"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createRestaurant } from "@/lib/api";
import {
  Store,
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import MapComponent from "@/components/map-component";

export default function AddRestaurant() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    email: "",
    logo: "/placeholder.svg?height=100&width=100", // Default placeholder
    latitude: 40.7128, // Default to New York City
    longitude: -74.006,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
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
        logo: `/placeholder.svg?height=200&width=200&text=Logo+${randomId}`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createRestaurant(formData);
      setSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/restaurants");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setError("Failed to create restaurant. Please try again.");
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
            <Store className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add New Restaurant</h1>
            <p className="text-gray-500 mt-1">
              Fill in the details below to add a new restaurant to your system.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700">
            Restaurant created successfully! Redirecting...
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo Upload Section */}
            <div className="col-span-1">
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Restaurant Logo
                </label>
                <p className="text-xs text-gray-500">
                  Upload a logo for your restaurant. Recommended size:
                  200x200px.
                </p>
              </div>

              <div
                onClick={handleLogoClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
              >
                <Image
                  src={formData.logo || "/placeholder.svg"}
                  alt="Restaurant Logo"
                  width={150}
                  height={150}
                  className="rounded-lg mb-4 object-cover"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo</span>
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
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Or enter logo URL
                </label>
                <input
                  id="logo"
                  name="logo"
                  type="text"
                  value={formData.logo}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Restaurant Details */}
            <div className="col-span-2 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Restaurant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    rows={3}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="restaurant@example.com"
                      className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      contactNumber Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                      className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium">Restaurant Location</h3>
            </div>
            <p className="text-sm text-gray-500">
              Set the exact location of your restaurant by clicking on the map
              or dragging the marker.
            </p>
            <MapComponent
              latitude={formData.latitude}
              longitude={formData.longitude}
              height="400px"
              zoom={14}
              onLocationChange={handleLocationChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  value={formData.latitude}
                  readOnly
                  className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700"
                >
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  value={formData.longitude}
                  readOnly
                  className="mt-1 w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-300 flex justify-end space-x-4">
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
                <span>Save Restaurant</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
