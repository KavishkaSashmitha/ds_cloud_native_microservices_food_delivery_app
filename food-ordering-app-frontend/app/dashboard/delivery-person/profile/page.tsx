"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { useDeliveryData } from "@/contexts/DeliveryContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const { deliveryPerson } = useDeliveryData();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Add form state for profile fields
  const [formData, setFormData] = useState({
    name: deliveryPerson?.name || user?.username || "",
    phone: "+94 71 234 5678", // Example data
    vehicleType: deliveryPerson?.vehicleType || "BIKE",
    vehicleNumber: "ABC-1234", // Example data
    address: "123 Main St, Colombo 5", // Example data
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // In a real app, you would call an API here
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and delivery preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal and vehicle information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    disabled={!isEditing}
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      handleSelectChange("vehicleType", value)
                    }
                  >
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BIKE">Motorcycle</SelectItem>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="SCOOTER">Scooter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats and Ratings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
              <CardDescription>Your delivery metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Completed Deliveries
                  </span>
                  <span className="font-medium">
                    {deliveryPerson?.completedDeliveries || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {deliveryPerson?.rating || "N/A"}
                    </span>
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">On-time Rate</span>
                  <span className="font-medium">97%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Acceptance Rate</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="pt-2 mt-2 border-t">
                  <Button variant="outline" className="w-full">
                    View Detailed Stats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium">Delivery Partner</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Joined On</span>
                  <span className="font-medium">January 15, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-green-500">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
