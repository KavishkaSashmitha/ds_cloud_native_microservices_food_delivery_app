import React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  currentStep: number
  children: React.ReactNode
}

interface StepProps {
  title: string
  description?: string
}

export function Steps({ currentStep, children }: StepsProps) {
  // Count the number of steps
  const steps = React.Children.toArray(children)
  const totalSteps = steps.length

  return (
    <div className="space-y-4">
      {React.Children.map(children, (child, index) => {
        // Check if the child is a valid React element
        if (!React.isValidElement(child)) return null

        // Determine the status of this step
        let status: "completed" | "current" | "upcoming" = "upcoming"
        if (index < currentStep) status = "completed"
        if (index === currentStep) status = "current"

        // Clone the child with additional props
        return React.cloneElement(child, {
          status,
          stepNumber: index + 1,
          isLastStep: index === totalSteps - 1,
        })
      })}
    </div>
  )
}

export function Step({
  title,
  description,
  status,
  stepNumber,
  isLastStep,
}: StepProps & {
  status?: "completed" | "current" | "upcoming"
  stepNumber?: number
  isLastStep?: boolean
}) {
  return (
    <div className="flex">
      {/* Step indicator */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
            status === "completed" && "border-orange-500 bg-orange-500 text-white",
            status === "current" && "border-orange-500 text-orange-500",
            status === "upcoming" && "border-gray-300 text-gray-300",
          )}
        >
          {stepNumber}
        </div>
        {!isLastStep && (
          <div className={cn("h-full w-0.5", status === "completed" ? "bg-orange-500" : "bg-gray-200")} />
        )}
      </div>

      {/* Step content */}
      <div className="ml-4 pb-8">
        <p
          className={cn(
            "font-medium",
            status === "completed" && "text-orange-500",
            status === "current" && "text-orange-500",
            status === "upcoming" && "text-gray-500",
          )}
        >
          {title}
        </p>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  )
}
