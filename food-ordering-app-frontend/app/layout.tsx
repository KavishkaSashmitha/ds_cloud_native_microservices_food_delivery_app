import { Providers } from "@/components/providers";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Delivery App",
  description: "Order food from your favorite restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
