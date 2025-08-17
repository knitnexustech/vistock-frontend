export interface User {
  id: string;
  email: string;
  role: "admin" | "client";
  createdAt: string;
  erpDomain?: string | null;
  apiKey?: string | null;
  apiSecret?: string | null;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  apiKey: string;
  apiSecret: string;
  erpDomain: string;
  role: "client" | "admin";
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}