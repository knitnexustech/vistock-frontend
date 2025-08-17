"use client";

import { useParams } from "next/navigation";
import ClientLayout from "@/components/client/layout/ClientLayout";
import CodeGenerateView from "@/components/client/products/CodeGenerateView";
import { useGet } from "@/hooks/core/useApi";
import { PRODUCT_API_ENDPOINTS } from "@/constants/product";
import { ProductDetailResponse } from "@/types/product";
import { queryKeys } from "@/lib/api/apiClient";
import LoadingState from "@/components/layout/LoadingState";
import ErrorState from "@/components/layout/ErrorState";

export default function CodeGeneratePage() {
  const params = useParams();
  const productId = params?.id as string;

  const {
    data: productData,
    isLoading,
    error,
  } = useGet<ProductDetailResponse>(
    queryKeys.products.detail(productId),
    PRODUCT_API_ENDPOINTS.GET_BY_ID(productId)
  );

  if (isLoading) {
    return (
      <ClientLayout>
        <LoadingState />
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <ErrorState
          title="Failed to load product"
          description="There was an error loading the product details. Please try again."
        />
      </ClientLayout>
    );
  }

  if (!productData?.product) {
    return (
      <ClientLayout>
        <ErrorState
          title="Product not found"
          description="The requested product could not be found."
        />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <CodeGenerateView product={productData.product} />
    </ClientLayout>
  );
}