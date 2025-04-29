"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import axios from "axios"
import { AxiosError } from 'axios';


// define the Address type
export interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  latitude: string
  longitude: string
  deliveryInstructions: string
}

interface AddAddressModalProps {
  onClose: () => void;
  onAddressAdded: (newAddress: Address) => void;
}

export default function AddAddressModal({ onClose, onAddressAdded }: AddAddressModalProps) {
  const [formData, setFormData] = useState<Address>({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    deliveryInstructions: "",
  })

  const [addresses, setAddresses] = useState<Address[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // You can still prepare or validate the payload here if needed
    const payload = {
      ...formData,
      coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
    };
  
    console.log("Prepared address data (not submitted):", payload);
  
    // Optionally pass dummy/simulated address to parent if needed
    onAddressAdded(payload);
  
    onClose(); // close the modal
  
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      deliveryInstructions: "",
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-orange-500 text-xl font-bold">Add New Address</DialogTitle>
          <DialogDescription>Fill in the details below to add a new address to your account.</DialogDescription>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
          >
            {/* <X className="h-4 w-4" /> */}
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="street" className="text-gray-700">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Home"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street" className="text-gray-700">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main St"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-700">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-gray-700">ZIP Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="10001"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-gray-700">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="40.7128"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-gray-700">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-74.0060"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
            <Label htmlFor="deliveryInstructions" className="text-gray-700">Delivery Instructions</Label>
            <Input
              id="deliveryInstructions"
              name="deliveryInstructions"
              value={formData.deliveryInstructions}
              onChange={handleChange}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 w-[450px]"
            />
          </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

// Fetch existing addresses when the component mounts
useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await axios.get('http://localhost:3003/addresses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAddresses(response.data.data) // Assuming the addresses are in response.data.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
            console.error("Failed to fetch addresses:", error.response?.data || error.message);
          } else {
            // If the error is not an AxiosError, handle it differently
            console.error("Unknown error:", error);
          }
        }
    }
    fetchAddresses()
  }, [])

  
}
