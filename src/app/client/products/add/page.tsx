"use client";

import ClientLayout from "@/components/client/layout/ClientLayout";
import AddProductForm from "@/components/client/products/AddProductForm";

export default function AddProductPage() {
  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
            <p className="text-gray-600">
              Add a new product to your inventory
            </p>
          </div>
        </div>

        {/* Add Product Form */}
        <AddProductForm />
      </div>
    </ClientLayout>
  );
}