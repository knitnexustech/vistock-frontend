"use client";

import { ArrowLeft, Edit, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { isDesktop } from "react-device-detect";

interface ProductHeaderProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onCodeGenerate: () => void;
}

export default function ProductHeader({
  product,
  onBack,
  onEdit,
  onCodeGenerate,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h1>
          <p className="text-sm text-gray-600">
            Item Code: {product.item_code}
          </p>
        </div>
      </div>
      {isDesktop && (
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={onCodeGenerate}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate Code
          </Button>
          <Button
            onClick={onEdit}
            className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </div>
      )}
    </div>
  );
}
