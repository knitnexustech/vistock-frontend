import { UseQueryOptions } from "@tanstack/react-query";
import { useGet } from "@/hooks/core/useApi";
import { queryKeys } from "@/lib/api/apiClient";

// User data type based on API response
export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

// API response wrapper
export interface UserProfileResponse {
  user: User;
}

// Hook to get current user data
export function useUserProfile(
  options?: Omit<UseQueryOptions<UserProfileResponse>, "queryKey" | "queryFn">
) {
  const query = useGet<UserProfileResponse>(
    queryKeys.user.me(),
    "/auth/me",
    undefined,
    options
  );

  return {
    ...query,
    data: query.data?.user, // Extract user from response wrapper
  };
}

