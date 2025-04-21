"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Clock, MapPin, Phone, Save, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestaurantData } from "@/lib/data-context";
import { toast } from "@/components/ui/use-toast";
import { TimeInput } from "@/components/time-input";
import { useIsMobile } from "@/hooks/use-mobile"

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
  preparationTime: string; // Changed from number to string
  deliveryRadius: number;
}

export default function RestaurantProfile() {
  const { profile, updateProfile } = useRestaurantData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RestaurantProfile>(profile);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isOpen: checked,
    }));
  };

  const handleBusinessHourChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const updatedHours = [...prev.businessHours];
      updatedHours[index] = {
        ...updatedHours[index],
        [field]: value,
      };
      return {
        ...prev,
        businessHours: updatedHours,
      };
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your restaurant profile has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Restaurant Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your restaurant information and settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="hours">Business Hours</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Information</CardTitle>
                    <CardDescription>
                      Basic details about your restaurant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuisine">Cuisine Type</Label>
                      <Input
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceRange">Price Range</Label>
                      <Input
                        id="priceRange"
                        name="priceRange"
                        value={formData.priceRange}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Restaurant Logo & Banner</CardTitle>
                      <CardDescription>
                        Upload images for your restaurant profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Restaurant Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                            <Image
                              src={
                                formData.logo ||
                                "/placeholder.svg?height=80&width=80"
                              }
                              alt="Restaurant logo"
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <Button variant="outline" disabled={!isEditing}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Restaurant Banner</Label>
                        <div className="relative h-40 w-full overflow-hidden rounded-md border">
                          <Image
                            src={
                              formData.banner ||
                              "/placeholder.svg?height=160&width=400"
                            }
                            alt="Restaurant banner"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="mt-2"
                          disabled={!isEditing}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Banner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        How customers can reach your restaurant
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Restaurant Address</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>
                    Set your restaurant's operating hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Restaurant Status</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.isOpen}
                          onCheckedChange={handleSwitchChange}
                          disabled={!isEditing}
                        />
                        <span
                          className={
                            formData.isOpen ? "text-green-600" : "text-red-600"
                          }
                        >
                          {formData.isOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {formData.businessHours.map((day, index) => (
                      <div
                        key={day.day}
                        className="grid grid-cols-3 items-center gap-4"
                      >
                        <div className="font-medium">{day.day}</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <TimeInput
                            disabled={!isEditing}
                            value={day.open}
                            onChange={(e) =>
                              handleBusinessHourChange(
                                index,
                                "open",
                                e.target.value
                              )
                            }
                          />
                          <span>to</span>
                          <TimeInput
                            disabled={!isEditing}
                            value={day.close}
                            onChange={(e) =>
                              handleBusinessHourChange(
                                index,
                                "close",
                                e.target.value
                              )
                            }
                          />
                          <Switch
                            checked={day.isOpen}
                            onCheckedChange={(checked) =>
                              handleBusinessHourChange(index, "isOpen", checked)
                            }
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" disabled={!isEditing}>
                    Reset to Default
                  </Button>
                  <Button disabled={!isEditing} onClick={handleSave}>
                    Apply Hours
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Settings</CardTitle>
                  <CardDescription>
                    Configure your delivery options and fees
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                      <Input
                        id="deliveryFee"
                        name="deliveryFee"
                        type="number"
                        value={formData.deliveryFee}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimumOrder">
                        Minimum Order Amount ($)
                      </Label>
                      <Input
                        id="minimumOrder"
                        name="minimumOrder"
                        type="number"
                        value={formData.minimumOrder}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preparationTime">
                      Average Preparation Time (minutes)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="preparationTime"
                        name="preparationTime"
                        type="text" // Changed from implicit number type
                        value={formData.preparationTime}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Radius</Label>
                    <div className="h-[200px] rounded-md border bg-muted/40 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Map will be displayed here
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        Delivery Radius: {formData.deliveryRadius} miles
                      </span>
                      <Button variant="outline" size="sm" disabled={!isEditing}>
                        Adjust Radius
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="ml-auto"
                    disabled={!isEditing}
                    onClick={handleSave}
                  >
                    Save Delivery Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
