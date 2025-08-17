import { useState, useEffect } from "react";
import { useGet } from "@/hooks/core/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductsResponse } from "@/types/product";
import { queryKeys } from "@/lib/api/apiClient";


interface UsePaginatedProductsResult {
  data: ProductsResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  search: string;
  setSearch: (search: string) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  refetch: () => void;
}

export function usePaginatedProducts(
  initialPage: number = 1,
  pageSize: number = 10
): UsePaginatedProductsResult {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(pageSize);
  const [search, setSearch] = useState("");
  
  // Debounce search with 300ms delay
  const debouncedSearch = useDebounce(search, 300);
  
  // Reset to page 1 when search changes
  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch.length === 0) {
      setPage(1);
    }
  }, [debouncedSearch]);

  // Build query parameters
  const buildEndpoint = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    
    // Only add search if it's at least 3 characters
    if (debouncedSearch && debouncedSearch.length >= 3) {
      params.append("search", debouncedSearch);
    }
    
    return `/products?${params.toString()}`;
  };

  // Create query key based on current parameters
  const createQueryKey = () => {
    const baseKey = queryKeys.products.all();
    return [
      ...baseKey,
      { 
        page, 
        limit, 
        search: debouncedSearch && debouncedSearch.length >= 3 ? debouncedSearch : undefined 
      }
    ];
  };

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGet<ProductsResponse>(
    createQueryKey(),
    buildEndpoint(),
    {
      // Only fetch if search is empty or has at least 3 characters
      enabled: !debouncedSearch || debouncedSearch.length >= 3,
    }
  );

  // Handle different API response formats
  const currentProducts = data?.products?.length ?? 0;
  const totalProducts = data?.total ?? 0;
  const serverTotalPages = data?.totalPages;
  
  // Calculate total pages
  const totalPages = serverTotalPages ?? (totalProducts > 0 ? Math.ceil(totalProducts / limit) : 0);
  
  // Always enable next button since we don't know if more products exist
  const hasNextPage = true;

  const pagination = {
    page,
    limit,
    totalPages: totalPages || 1,
    totalProducts: totalProducts || currentProducts,
    hasNextPage,
    hasPreviousPage: page > 1,
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && (totalPages === 0 || newPage <= totalPages)) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return {
    data,
    isLoading,
    error,
    pagination,
    search,
    setSearch,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  };
}