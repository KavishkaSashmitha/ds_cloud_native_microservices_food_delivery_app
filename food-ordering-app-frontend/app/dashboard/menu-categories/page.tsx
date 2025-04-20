"use client"
import { CategoryManagement } from "@/components/category-management"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MenuCategories() {
  return (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Menu Categories</h1>
            <p className="text-muted-foreground">Manage categories to organize your menu items</p>
          </div>
        </div>

        <CategoryManagement />
      </div>
    </div>
  </DashboardLayout>
  )
}
