"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function SearchForm() {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input type="search" placeholder="Search..." className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]" />
    </div>
  )
}
