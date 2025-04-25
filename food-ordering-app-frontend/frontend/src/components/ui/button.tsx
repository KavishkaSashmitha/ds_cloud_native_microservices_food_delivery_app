// src/components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

// Define possible variants
export type ButtonVariant = "ghost" | "solid" | "outline"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;  // Add the variant prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "solid", ...props }, ref) => {
  // Define base styles
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  // Define variant styles
  const variantStyles = {
    ghost: "bg-transparent text-primary border border-primary hover:bg-primary/10",
    solid: "bg-primary text-white hover:bg-primary/90",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary/10"
  };

  // Combine base styles with the selected variant and any custom class names
  const buttonStyles = cn(
    baseStyles,
    variantStyles[variant],  // Apply the styles based on the variant
    className
  );

  return (
    <button
      ref={ref}
      className={buttonStyles}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }

