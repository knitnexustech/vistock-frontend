"use client";

import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  label?: string;
  required?: boolean;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void | Promise<void>;
  imagePreview: string | null;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

export default function ImageUpload({
  label = "Image (Optional)",
  required = false,
  onImageSelect,
  onImageRemove,
  imagePreview,
  maxSizeMB = 5,
  acceptedFormats = ["PNG", "JPG", "GIF"],
}: ImageUploadProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Image size should be less than ${maxSizeMB}MB`);
        return;
      }

      onImageSelect(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!imagePreview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload image</span>
            <span className="text-xs text-gray-400">
              {acceptedFormats.join(", ")} up to {maxSizeMB}MB
            </span>
          </label>
        </div>
      ) : (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden w-48 h-48 mx-auto">
          <Image
            src={imagePreview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

