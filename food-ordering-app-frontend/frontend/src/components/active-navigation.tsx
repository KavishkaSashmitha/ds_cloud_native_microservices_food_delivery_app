"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function ActiveNavigation() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-4 p-4">
      <Link
        href="/"
        className={cn("transition-colors hover:text-orange-500", pathname === "/" && "font-bold text-orange-600")}
      >
        {/* Home */}
      </Link>
      <Link
        href="/about"
        className={cn("transition-colors hover:text-orange-500", pathname === "/about" && "font-bold text-orange-600")}
      >
        About
      </Link>
      {/* Add more navigation links as needed */}
    </nav>
  )
}
