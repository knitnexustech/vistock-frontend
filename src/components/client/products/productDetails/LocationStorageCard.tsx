"use client";

import { Building, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LocationStorageCardProps {
  warehouse: string;
  floor: string;
  rackNo: string;
}

export default function LocationStorageCard({ 
  warehouse, 
  floor, 
  rackNo 
}: LocationStorageCardProps) {
  return (
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
            <p className="text-gray-900">{warehouse}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <MapPin className="h-4 w-4" />
              Floor
            </div>
            <p className="text-gray-900">
              {floor === "0" ? "0 (Ground Floor)" : floor}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <MapPin className="h-4 w-4" />
              Rack Number
            </div>
            <p className="text-gray-900">{rackNo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}