"use client";

import { Package, FileText, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BasicInformationCardProps {
  name: string;
  itemGroup: string;
  description?: string;
}

export default function BasicInformationCard({ 
  name, 
  itemGroup, 
  description 
}: BasicInformationCardProps) {
  return (
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
            <p className="text-gray-900 break-words">{name}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Tag className="h-4 w-4" />
              Item Group
            </div>
            <p className="text-gray-900">{itemGroup}</p>
          </div>
        </div>
        
        {description && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <FileText className="h-4 w-4" />
              Description
            </div>
            <p className="text-gray-900 break-words">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}