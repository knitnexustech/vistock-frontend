export const USER_API_ENDPOINTS = {
  GET_ALL: "/users/admin/get-all",
  CREATE: "/users/admin/create",
  UPDATE: "/users/admin/update",
} as const;

export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  ALL_USERS: "/admin/users",
  ADD_USER: "/admin/users/add",
} as const;