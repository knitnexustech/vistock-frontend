"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PublicProductDetailsView from "@/components/public/PublicProductDetailsView";
import { useGet } from "@/hooks/core/useApi";
import { ProductDetailResponse } from "@/types/product";
import { PRODUCT_API_ENDPOINTS, CLIENT_ROUTES } from "@/constants/product";
import LoadingState from "@/components/layout/LoadingState";
import ErrorState from "@/components/layout/ErrorState";
import { useAuthStore } from "@/stores/authStore";

export default function PublicProductPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.tenantId as string;
  const barcode = params?.barcode as string;
  const [shouldFetchPublic, setShouldFetchPublic] = useState(false);

  const { token, user } = useAuthStore();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // If user is not authenticated, show public view immediately
      if (!token || !user) {
        setShouldFetchPublic(true);
        return;
      }

      // Verify if token is still valid
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch(() => null);

      // If token is invalid, show public view
      if (!authResponse?.ok) {
        setShouldFetchPublic(true);
        return;
      }

      // User is authenticated, try to redirect to authenticated product page
      const productResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${PRODUCT_API_ENDPOINTS.GET_PUBLIC_BY_BARCODE(tenantId, barcode)}`
      ).catch(() => null);

      if (productResponse?.ok) {
        const productData = await productResponse.json().catch(() => null);
        if (productData?.product?.item_code) {
          router.replace(CLIENT_ROUTES.PRODUCT_DETAILS(productData.product.item_code));
          return;
        }
      }

      // Fallback to public view if redirect fails
      setShouldFetchPublic(true);
    };

    // Only run the check if auth store has hydrated
    const { hasHydrated } = useAuthStore.getState();
    if (hasHydrated) {
      checkAuthAndRedirect();
    } else {
      // If not hydrated yet, wait a bit and try again
      const timeout = setTimeout(() => {
        checkAuthAndRedirect();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [token, user, router, tenantId, barcode]);

  const {
    data: productData,
    isLoading,
    error,
  } = useGet<ProductDetailResponse>(
    ["public", "products", tenantId, barcode],
    PRODUCT_API_ENDPOINTS.GET_PUBLIC_BY_BARCODE(tenantId, barcode),
    undefined, // No URL parameters needed
    {
      enabled: shouldFetchPublic, // Only fetch when we've determined user should see public view
    }
  );

  // Show loading while checking authentication or fetching data
  if (!shouldFetchPublic || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorState
          title="Failed to load product"
          description="There was an error loading the product details. Please try again."
        />
      </div>
    );
  }

  if (!productData?.product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorState
          title="Product not found"
          description="The requested product could not be found."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicProductDetailsView product={productData.product} />
    </div>
  );
}
