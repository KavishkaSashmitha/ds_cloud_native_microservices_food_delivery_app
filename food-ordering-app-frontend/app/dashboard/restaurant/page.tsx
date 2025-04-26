import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Package, ShoppingBag, Store } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button"; // Replace with your custom Button component
import { DashboardLayout } from "@/components/dashboard-layout";
import { RestaurantProvider } from "@/lib/data-context";

export default function page() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Orders Today
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">+3 from yesterday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Need confirmation</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">3 categories</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$342.50</div>
          <p className="text-xs text-muted-foreground">
            +$42.20 from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>Orders waiting for confirmation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Order #1234</p>
                <p className="text-sm text-muted-foreground">
                  2x Burger, 1x Fries, 1x Coke
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm" variant="default">
                  Accept
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Order #1235</p>
                <p className="text-sm text-muted-foreground">
                  1x Pizza, 2x Garlic Bread
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order #1236</p>
                <p className="text-sm text-muted-foreground">
                  3x Tacos, 1x Nachos
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Reject
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Popular Items</CardTitle>
          <CardDescription>Your most ordered items today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Chicken Burger</p>
                  <p className="text-sm text-muted-foreground">
                    12 orders today
                  </p>
                </div>
              </div>
              <p className="font-medium">$8.99</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">French Fries</p>
                  <p className="text-sm text-muted-foreground">
                    10 orders today
                  </p>
                </div>
              </div>
              <p className="font-medium">$3.99</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Chocolate Milkshake</p>
                  <p className="text-sm text-muted-foreground">
                    8 orders today
                  </p>
                </div>
              </div>
              <p className="font-medium">$4.50</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
