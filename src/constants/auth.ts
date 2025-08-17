export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
} as const;

export const DASHBOARD_ROUTES = {
  CLIENT: "/client/dashboard",
  ADMIN: "/admin/dashboard",
} as const;

export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  ME: "/auth/me",
} as const;

export const TOKEN_KEY = "auth_token" as const;
export const USER_KEY = "auth_user" as const;