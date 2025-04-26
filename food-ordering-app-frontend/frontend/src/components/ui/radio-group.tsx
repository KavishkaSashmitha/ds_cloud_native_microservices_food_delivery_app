import * as React from "react";
import { cn } from "@/lib/utils";

// Define props interface for RadioGroupItem
interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  children?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2">
        <input
          ref={ref}
          type="radio"
          value={value}
          className={cn("h-4 w-4 border-gray-300 text-primary focus:ring-primary", className)}
          {...props}
        />
        {children}
      </label>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

// Define props interface for RadioGroup
interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactElement<RadioGroupItemProps>[];
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid gap-2", className)}
        role="radiogroup"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<RadioGroupItemProps>(child)) {
            return React.cloneElement(child, {
              checked: child.props.value === value,
              onChange: () => onValueChange(child.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";



