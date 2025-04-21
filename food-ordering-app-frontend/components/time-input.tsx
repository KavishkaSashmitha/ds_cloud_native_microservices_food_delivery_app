import { Input } from "./ui/input";
import { ChangeEvent } from "react";

interface TimeInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function TimeInput({ value, onChange, disabled }: TimeInputProps) {
  return (
    <Input
      type="time"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-32"
    />
  );
}
