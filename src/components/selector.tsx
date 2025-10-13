"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SelectorProps {
  options?: { label: string; value: string }[];
  value: string;
  onChange(selected: string): void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export default function Selector({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  isLoading = false,
  disabled = false,
  required = false
}: SelectorProps) {

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
      required={required}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            isLoading
              ? "Cargando…"
              : placeholder
          }
        />
      </SelectTrigger>
      <SelectContent>
        {!required && <SelectItem value=" ">No elegir</SelectItem>}
        <SelectSeparator />
        {
          options?.map((option) => {
            return <SelectItem
              key={option.value}
              value={option.value}
            >{option.label}</SelectItem>
          })
        }
      </SelectContent>
    </Select>
  )
}
