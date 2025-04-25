// src/components/ui/card.tsx
import * as React from "react"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={` border p-4 shadow ${className ?? ""}`} {...props} />
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-2 border shadow font-semibold text-lg ${className ?? ""}`} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-xl font-bold ${className ?? ""}`} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-2 ${className ?? ""}`} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-2 text-right ${className ?? ""}`} {...props} />
}
