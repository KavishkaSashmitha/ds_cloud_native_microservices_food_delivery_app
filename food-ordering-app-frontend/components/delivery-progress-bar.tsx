import { CheckCircle, CircleDashed, MapPin, Package } from "lucide-react"

import { cn } from "@/lib/utils"

interface DeliveryProgressBarProps {
  status: string
}

export function DeliveryProgressBar({ status }: DeliveryProgressBarProps) {
  const steps = [
    {
      id: "accepted",
      label: "Accepted",
      icon: <CircleDashed className="h-5 w-5" />,
      complete: true,
    },
    {
      id: "picking-up",
      label: "Picking Up",
      icon: <Package className="h-5 w-5" />,
      complete: ["picking-up", "on-the-way", "delivered"].includes(status),
      active: status === "picking-up",
    },
    {
      id: "on-the-way",
      label: "On The Way",
      icon: <MapPin className="h-5 w-5" />,
      complete: ["on-the-way", "delivered"].includes(status),
      active: status === "on-the-way",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: <CheckCircle className="h-5 w-5" />,
      complete: status === "delivered",
      active: status === "delivered",
    },
  ]

  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-1 flex-col items-center">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2",
              step.complete
                ? "border-primary bg-primary text-primary-foreground"
                : step.active
                  ? "border-primary text-primary"
                  : "border-muted-foreground/30 text-muted-foreground",
            )}
          >
            {step.icon}
          </div>
          <span
            className={cn(
              "mt-2 text-xs",
              step.active ? "font-medium text-primary" : step.complete ? "font-medium" : "text-muted-foreground",
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "absolute h-0.5 w-[calc(25%-20px)] translate-x-[calc(50%+10px)]",
                step.complete ? "bg-primary" : "bg-muted-foreground/30",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
