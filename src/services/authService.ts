import axios, { AxiosInstance } from 'axios';

interface LoginResponse {
  accessToken: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin?: string;
  };
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

      if (response.data.accessToken) {
        localStorage.setItem(this.tokenKey, response.data.accessToken);
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

  async signup(name: string, email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/signup', {
        name,
        email,
        password,
      });

      if (response.data.accessToken) {
        localStorage.setItem(this.tokenKey, response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.message || 'Signup failed. Please try again.'
        );
      }
      throw new Error('Signup failed. Please try again.');
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
}

export default new AuthService();
