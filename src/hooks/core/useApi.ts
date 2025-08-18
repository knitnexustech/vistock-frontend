import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authenticatedApiRequest, apiRequest } from "@/lib/api/api";
import { useAuthStore } from "@/stores/authStore";

// Simplified GET hook with optional parameters
export function useGet<TData = any, TError = any>(
  queryKey: readonly unknown[],
  endpoint: string,
  params?: Record<string, string | number>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) {
  const { token, isLoading, hasHydrated } = useAuthStore();

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      // Wait for hydration to complete before making requests
      if (!hasHydrated) {
        throw new Error("Store not hydrated yet");
      }

      // Replace parameters in endpoint if provided
      let finalEndpoint = endpoint;
      if (params) {
        finalEndpoint = Object.entries(params).reduce(
          (url, [key, value]) => url.replace(`:${key}`, String(value)),
          endpoint
        );
      }

      if (token) {
        return authenticatedApiRequest<TData>(finalEndpoint, {}, token);
      } else {
        return apiRequest<TData>(finalEndpoint);
      }
    },
    enabled: hasHydrated && !isLoading && (options?.enabled ?? true),
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
}

// Simplified mutation hook with optional parameters
export function useMutate<TData = any, TVariables = any, TError = any>(
  endpoint: string | ((variables: TVariables) => string),
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
) {
  const { token, hasHydrated } = useAuthStore();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      // Wait for hydration to complete before making requests
      if (!hasHydrated) {
        throw new Error("Store not hydrated yet");
      }

      const url =
        typeof endpoint === "function" ? endpoint(variables) : endpoint;

      const requestOptions = {
        method,
        body: method !== "DELETE" ? JSON.stringify(variables) : undefined,
      };

      if (token) {
        return authenticatedApiRequest<TData>(url, requestOptions, token);
      } else {
        return apiRequest<TData>(url, requestOptions);
      }
    },
    ...options,
  });
}

