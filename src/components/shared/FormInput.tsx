import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "url";
  placeholder: string;
  icon?: LucideIcon;
  error?: string;
  register: UseFormRegisterReturn;
  className?: string;
  required?: boolean;
  step?: string;
  disabled?: boolean;
}

export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  register,
  className = "",
  required = false,
  step,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          step={step}
          disabled={disabled}
          className={`${
            Icon ? "pl-10" : ""
          } h-12 border-gray-300 focus:border-primary focus:ring-primary ${className}`}
          {...register}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
