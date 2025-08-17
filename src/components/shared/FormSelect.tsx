"use client";

import { LucideIcon } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import Select from "react-select";

interface FormSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  name: string;
  required?: boolean;
  defaultValue?: string;
}

export default function FormSelect({
  id,
  label,
  placeholder = "Select option",
  icon: Icon,
  error,
  options,
  control,
  name,
  required = false,
  defaultValue,
}: FormSelectProps) {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '48px',
      height: '48px',
      paddingLeft: Icon ? '2.5rem' : '1rem',
      borderColor: error ? '#ef4444' : state.isFocused ? 'hsl(var(--primary))' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: error ? '#ef4444' : '#9ca3af',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151',
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
        )}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || ""}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              ref={ref}
              value={options.find((option) => option.value === value) || null}
              onChange={(selectedOption) => onChange(selectedOption?.value || "")}
              options={options}
              placeholder={placeholder}
              styles={customStyles}
              classNamePrefix="react-select"
              isClearable={false}
              isSearchable={true}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            />
          )}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}