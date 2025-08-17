// API client configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is required");
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API fetch function with error handling
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors and other fetch errors
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      0,
      "Network Error"
    );
  }
}

// Authenticated API request (will be enhanced when auth tokens are available)
export async function authenticatedApiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const authHeaders: HeadersInit = {};

  if (token) {
    authHeaders.Authorization = `Bearer ${token}`;
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders,
    },
  });
}

// Specific API endpoints
export const api = {} as const;

