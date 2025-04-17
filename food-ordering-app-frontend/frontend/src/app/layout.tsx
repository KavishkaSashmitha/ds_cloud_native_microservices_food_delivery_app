import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { CartProvider } from "@/lib/cart-context"
import Cart from "@/components/cart"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chipis Restaurant Management System",
  description: "Restaurant Management System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
          <Cart />
        </CartProvider>
      </body>
    </html>
  )
}
