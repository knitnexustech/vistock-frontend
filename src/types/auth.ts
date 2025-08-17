export interface User {
  id: string;
  email: string;
  role: "client" | "admin";
  createdAt: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}