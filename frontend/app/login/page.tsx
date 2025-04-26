"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth, type UserRole } from "@/contexts/auth-context";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password, userRole);
      toast({
        title: "Login successful",
        description: `Welcome back! You are now logged in as a ${userRole}.`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container flex flex-col items-center justify-center py-10 px-4">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 self-start transition-colors hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex w-full flex-col items-center">
          <div className="mb-6 flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8 text-orange-500" />
            <span className="text-3xl font-bold">FoodExpress</span>
          </div>

          <Card className="w-full max-w-md border-orange-100 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl font-bold">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-3">
                  <Label htmlFor="role" className="font-medium">
                    Select your role
                  </Label>
                  <RadioGroup
                    id="role"
                    value={userRole}
                    onValueChange={(value) => setUserRole(value as UserRole)}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border border-orange-100 p-2 transition-colors hover:bg-orange-50">
                      <RadioGroupItem value="customer" id="customer" />
                      <Label htmlFor="customer" className="cursor-pointer">
                        Customer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border border-orange-100 p-2 transition-colors hover:bg-orange-50">
                      <RadioGroupItem value="restaurant" id="restaurant" />
                      <Label htmlFor="restaurant" className="cursor-pointer">
                        Restaurant Admin
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border border-orange-100 p-2 transition-colors hover:bg-orange-50">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="cursor-pointer">
                        Delivery Personnel
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border border-orange-100 p-2 transition-colors hover:bg-orange-50">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin" className="cursor-pointer">
                        System Admin
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-orange-100 focus-visible:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-medium">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-orange-500 hover:underline hover:text-orange-600"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-orange-100 focus-visible:ring-orange-500"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pb-6">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-orange-500 hover:underline hover:text-orange-600"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
