import { supabase } from './lib/supabase';
import { Product, Transaction, User, DashboardStats } from './types';

const API_ROOT = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
  .toString()
  .replace(/\/+$/, '');
const API_BASE = `${API_ROOT}/api`;

const getHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
};

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const res = await fetch(`${API_BASE}/products`, { headers: await getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || []);
    },
    create: async (product: Partial<Product>): Promise<Product> => {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(product),
      });
      return res.json();
    },
    update: async (id: string, product: Partial<Product>): Promise<Product> => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(product),
      });
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });
    },
  },

  transactions: {
    getAll: async (): Promise<Transaction[]> => {
      const res = await fetch(`${API_BASE}/transactions`, { headers: await getHeaders() });
      const data = await res.json();
      return Array.isArray(data) ? data : (data.items || []);
    },
    create: async (tx: Partial<Transaction>): Promise<Transaction> => {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(tx),
      });
      return res.json();
    },
  },

  users: {
    getAll: async (): Promise<User[]> => {
      const res = await fetch(`${API_BASE}/users`, { headers: await getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    create: async (user: Partial<User> & { password?: string }): Promise<User> => {
      const { password, ...rest } = user;
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify({ ...rest, password }),
      });
      if (!res.ok) throw new Error('Failed to create user');
      return res.json();
    },
    update: async (id: string, user: Partial<User>): Promise<User> => {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify({ role: user.role, status: user.status, name: user.name }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return res.json();
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete user');
    },
  },

  stats: {
    getDashboard: async (): Promise<DashboardStats> => {
      const res = await fetch(`${API_BASE}/stats`, { headers: await getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return res.json();
    },
  },
};
