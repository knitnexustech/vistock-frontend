"use client";

import Image from "next/image";
import {
  Package,
  FileText,
  Tag,
  Ruler,
  Palette,
  Calculator,
  Building,
  MapPin,
  Barcode,
  MessageSquare,
  IndianRupee,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import isValidImageUrl from "@/utils/isValidImageUrl";
import ImageNotAvailable from "@/assets/images/image-not-available.jpeg";

interface PublicProductDetailsViewProps {
  product: Product;
}

export default function PublicProductDetailsView({
  product,
}: PublicProductDetailsViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        <p className="text-lg text-gray-600">Item Code: {product.item_code}</p>
      </div>

      {/* Image & Location Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Product Image */}
        {product.image && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative sm:w-full w-48 h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={
                    product.image && isValidImageUrl(product.image)
                      ? product.image
                      : ImageNotAvailable
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location & Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Location & Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Building className="h-4 w-4" />
                  Warehouse
                </div>
                <p className="text-gray-900">{product.warehouse}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Floor
                </div>
                <p className="text-gray-900">
                  {product.floor === "0" ? "0 (Ground Floor)" : product.floor}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Rack Number
                </div>
                <p className="text-gray-900">{product.rack_no}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Package className="h-4 w-4" />
                Product Name
              </div>
              <p className="text-gray-900 break-words">{product.name}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Tag className="h-4 w-4" />
                Item Group
              </div>
              <p className="text-gray-900">{product.item_group}</p>
            </div>
          </div>

          {product.description && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <FileText className="h-4 w-4" />
                Description
              </div>
              <p className="text-gray-900 break-words">{product.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Ruler className="h-4 w-4" />
                Size
              </div>
              <p className="text-gray-900">{product.size}</p>
            </div>

            {product.colour && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Palette className="h-4 w-4" />
                  Color
                </div>
                <p className="text-gray-900">{product.colour}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Calculator className="h-4 w-4" />
                Quantity
              </div>
              <p className="text-gray-900">{product.quantity}</p>
            </div>

            {product.UOM && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Calculator className="h-4 w-4" />
                  Unit of Measurement
                </div>
                <p className="text-gray-900">{product.UOM}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Barcode className="h-4 w-4" />
                Barcode
              </div>
              <p className="text-gray-900 font-mono">{product.barcode}</p>
            </div>

            {product.MRP > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <IndianRupee className="h-4 w-4" />
                  MRP
                </div>
                <p className="text-gray-900">₹{product.MRP.toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {product.comment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <MessageSquare className="h-4 w-4" />
                Comments
              </div>
              <p className="text-gray-900 break-words">{product.comment}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Product information provided by KnitNexus
        </p>
      </div>
    </div>
  );
}

