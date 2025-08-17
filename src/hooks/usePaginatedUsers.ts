import { useState, useEffect } from "react";
import { useGet } from "@/hooks/core/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { UsersResponse } from "@/types/user";
import { queryKeys } from "@/lib/api/apiClient";

interface UsePaginatedUsersResult {
  data: UsersResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalUsers: number;
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

export function usePaginatedUsers(
  initialPage: number = 1,
  pageSize: number = 10
): UsePaginatedUsersResult {
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
    
    return `/users/admin/get-all?${params.toString()}`;
  };

  // Create query key based on current parameters
  const createQueryKey = () => {
    const baseKey = queryKeys.users.list();
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
  } = useGet<UsersResponse>(
    createQueryKey(),
    buildEndpoint(),
    undefined,
    {
      // Only fetch if search is empty or has at least 3 characters
      enabled: !debouncedSearch || debouncedSearch.length >= 3,
    }
  );

  // Handle different API response formats
  const currentUsers = data?.users?.length ?? 0;
  const totalUsers = data?.pagination?.total ?? 0;
  const serverTotalPages = Math.ceil(totalUsers / limit);
  
  // Calculate total pages
  const totalPages = serverTotalPages || (totalUsers > 0 ? Math.ceil(totalUsers / limit) : 0);
  
  // Always enable next button since we don't know if more users exist
  const hasNextPage = true;

  const pagination = {
    page,
    limit,
    totalPages: totalPages || 1,
    totalUsers: totalUsers || currentUsers,
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