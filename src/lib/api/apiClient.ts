import { QueryClient } from "@tanstack/react-query";

// Production-ready QueryClient configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes - data is considered fresh for this duration
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes - data stays in cache for this duration when unused
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production for data freshness
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect to avoid unnecessary requests
      refetchOnReconnect: false,
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // User-related queries
  user: {
    all: ["user"] as const,
    me: () => [...queryKeys.user.all, "me"] as const,
    profile: (id: string) => [...queryKeys.user.all, "profile", id] as const,
  },
  // Admin user management queries
  users: {
    all: () => ["users"] as const,
    list: (filters?: any) => [...queryKeys.users.all(), "list", filters] as const,
  },
  // Product-related queries
  products: {
    all: () => ["products"] as const,
    list: (filters?: any) => [...queryKeys.products.all(), "list", filters] as const,
    detail: (id: string) => [...queryKeys.products.all(), "detail", id] as const,
  },
} as const;

