"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientLayout from "@/components/client/layout/ClientLayout";
import ProductsTable from "@/components/client/products/ProductsTable";
import { CLIENT_ROUTES, PRODUCT_API_ENDPOINTS } from "@/constants/product";
import { Product } from "@/types/product";
import ErrorState from "@/components/layout/ErrorState";
import { toast } from "sonner";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";
import { useMutate } from "@/hooks/core/useApi";
import { queryKeys } from "@/lib/api/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { ApiError } from "@/lib/api/api";
import { deleteImageFromS3 } from "@/utils/imageUtils";

export default function AllProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: productsData,
    isLoading,
    error,
    pagination,
    search,
    setSearch,
    goToPage,
    nextPage,
    previousPage,
  } = usePaginatedProducts(1, 10);

  const handleEdit = (product: Product) => {
    router.push(CLIENT_ROUTES.EDIT_PRODUCT(product.item_code));
  };

  const deleteProductMutation = useMutate<void, { item_code: string }>(
    (variables) => PRODUCT_API_ENDPOINTS.DELETE(variables.item_code),
    "DELETE",
    {
      onSuccess: () => {
        toast.success("Product deleted successfully!");
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      },
      onError: (error: ApiError) => {
        toast.error(
          error?.message || "Failed to delete product. Please try again."
        );
      },
    }
  );

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Helper function to extract S3 key from full image URL
  const extractS3KeyFromUrl = (imageUrl: string): string | null => {
    try {
      const url = new URL(imageUrl);
      // Remove the leading slash from pathname to get the S3 key
      return url.pathname.substring(1);
    } catch {
      return null;
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      // First, delete the image from S3 if it exists
      if (productToDelete.image) {
        const s3Key = extractS3KeyFromUrl(productToDelete.image);
        if (s3Key) {
          toast.info("Deleting product image...");
          const imageDeleted = await deleteImageFromS3(s3Key);
          if (!imageDeleted) {
            toast.warning("Failed to delete product image from storage, but continuing with product deletion...");
          }
        }
      }

      // Then delete the product from the backend
      deleteProductMutation.mutate({ item_code: productToDelete.item_code });
    } catch (error) {
      toast.error("Failed to delete product image. Product deletion cancelled.");
      console.error("Image deletion error:", error);
    }
  };

  const handleView = (product: Product) => {
    router.push(CLIENT_ROUTES.PRODUCT_DETAILS(product.item_code));
  };

  const handleGenerateCode = (product: Product) => {
    router.push(CLIENT_ROUTES.CODE_GENERATE(product.item_code));
  };

  if (error) {
    return (
      <ClientLayout>
        <ErrorState
          title="Failed to load products"
          description="There was an error loading the products. Please try again."
        />
      </ClientLayout>
    );
  }

  const products = productsData?.products || [];

  return (
    <ClientLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-start mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-600">
            Manage and view your product inventory
          </p>
        </div>

        {/* Products Table */}
        <div className="flex-1 overflow-hidden">
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onGenerateQR={handleGenerateCode}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={goToPage}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            searchValue={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Product"
          description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          isLoading={deleteProductMutation.isPending}
          variant="destructive"
        />
      </div>
    </ClientLayout>
  );
}
