"use client";

import { useRouter } from "next/navigation";
import ClientLayout from "@/components/client/layout/ClientLayout";
import ProductsTable from "@/components/client/products/ProductsTable";
import { CLIENT_ROUTES } from "@/constants/product";
import { Product } from "@/types/product";
import ErrorState from "@/components/layout/ErrorState";
import { toast } from "sonner";
import { usePaginatedProducts } from "@/hooks/usePaginatedProducts";

export default function AllProductsPage() {
  const router = useRouter();

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

  const handleDelete = (product: Product) => {
    // For now, just show a toast - actual delete functionality would be implemented later
    toast.info(
      `Delete functionality for ${product.name} would be implemented here`
    );
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
      </div>
    </ClientLayout>
  );
}
