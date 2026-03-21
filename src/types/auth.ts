// Auth-related type definitions
export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface LoginResponse {
  access_token: string;
  user?: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}
