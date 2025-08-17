"use client";

import { Ruler, Palette, Calculator, Barcode, IndianRupee } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductDetailsCardProps {
  size: string;
  colour?: string;
  quantity: number;
  uom?: string;
  barcode: string;
  mrp: number;
}

export default function ProductDetailsCard({ 
  size, 
  colour, 
  quantity, 
  uom, 
  barcode, 
  mrp 
}: ProductDetailsCardProps) {
  return (
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
            <p className="text-gray-900">{size}</p>
          </div>

          {colour && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Palette className="h-4 w-4" />
                Color
              </div>
              <p className="text-gray-900">{colour}</p>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Calculator className="h-4 w-4" />
              Quantity
            </div>
            <p className="text-gray-900">{quantity}</p>
          </div>

          {uom && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Calculator className="h-4 w-4" />
                Unit of Measurement
              </div>
              <p className="text-gray-900">{uom}</p>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Barcode className="h-4 w-4" />
              Barcode
            </div>
            <p className="text-gray-900 font-mono">{barcode}</p>
          </div>

          {mrp > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <IndianRupee className="h-4 w-4" />
                MRP
              </div>
              <p className="text-gray-900">₹{mrp.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}