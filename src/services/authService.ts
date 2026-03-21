import axios, { AxiosInstance } from 'axios';

interface LoginResponse {
  access_token: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
  };
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

class AuthService {
  private api: AxiosInstance;
  private tokenKey = 'sp_token';

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem(this.tokenKey, response.data.access_token);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.message || 'Login failed. Please check your credentials.'
        );
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/register', {
        email,
        password,
        fullName,
      });

      if (response.data.access_token) {
        localStorage.setItem(this.tokenKey, response.data.access_token);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.message || 'Registration failed. Please try again.'
        );
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

export default new AuthService();
