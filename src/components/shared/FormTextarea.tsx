import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: LucideIcon;
  error?: string;
  register: UseFormRegisterReturn;
  className?: string;
  required?: boolean;
  rows?: number;
}

export default function FormTextarea({
  id,
  label,
  placeholder,
  icon: Icon,
  error,
  register,
  className = "",
  required = false,
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        )}
        <textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${className}`}
          {...register}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}