"use client";

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import isValidImageUrl from "@/utils/isValidImageUrl";
import ImageNotAvailable from "@/assets/images/image-not-available.jpeg";

interface ProductImageCardProps {
  imageUrl: string;
  productName: string;
}

export default function ProductImageCard({
  imageUrl,
  productName,
}: ProductImageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Product Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={
              imageUrl && isValidImageUrl(imageUrl)
                ? imageUrl
                : ImageNotAvailable
            }
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>
    </Card>
  );
}

