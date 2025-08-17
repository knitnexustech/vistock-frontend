"use client";

import { use } from "react";
import ClientLayout from "@/components/client/layout/ClientLayout";
import EditProductForm from "@/components/client/products/EditProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">
              Update product information and save changes
            </p>
          </div>
        </div>

        {/* Edit Product Form */}
        <EditProductForm productId={id} />
      </div>
    </ClientLayout>
  );
}