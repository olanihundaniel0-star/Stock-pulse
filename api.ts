import { Product, Transaction, User, UserRole } from './types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('stockpulse_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('stockpulse_token', data.token);
      return data;
    },
    signup: async (name: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) throw new Error('Failed to sign up');
      const data = await res.json();
      localStorage.setItem('stockpulse_token', data.token);
      return data;
    },
    logout: () => {
      localStorage.removeItem('stockpulse_token');
    }
  },

  products: {
    getAll: async (): Promise<Product[]> => {
      const res = await fetch(`${API_BASE}/products`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
    create: async (product: Partial<Product>): Promise<Product> => {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product)
      });
      return res.json();
    },
    update: async (id: string, product: Partial<Product>): Promise<Product> => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(product)
      });
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    }
  },

  transactions: {
    getAll: async (): Promise<Transaction[]> => {
      const res = await fetch(`${API_BASE}/transactions`, { headers: getHeaders() });
      return res.json();
    },
    create: async (tx: Partial<Transaction>): Promise<Transaction> => {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tx)
      });
      return res.json();
    }
  },

  stats: {
    getDashboard: async () => {
      const res = await fetch(`${API_BASE}/stats`, { headers: getHeaders() });
      return res.json();
    }
  }
};
