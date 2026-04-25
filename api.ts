import { supabase } from './lib/supabase';
import { Company, Product, Transaction, User, DashboardStats } from './types';

export const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api')
  .toString()
  .replace(/\/+$/, '');

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

const readErrorMessage = async (res: Response, fallback: string): Promise<string> => {
  try {
    const payload = await res.json();
    if (payload && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
    if (payload && typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Ignore JSON parse errors and use fallback.
  }
  return `${fallback} (${res.status})`;
};

const reasonToBackend: Record<string, string> = {
  Sale: 'Sale',
  Damaged: 'Damaged',
  Expired: 'Expired',
  'Theft/Loss': 'Theft_Loss',
  'Sample/Giveaway': 'Sample_Giveaway',
  'Internal Use': 'Internal_Use',
};

const reasonFromBackend: Record<string, string> = {
  Sale: 'Sale',
  Damaged: 'Damaged',
  Expired: 'Expired',
  Theft_Loss: 'Theft/Loss',
  Sample_Giveaway: 'Sample/Giveaway',
  Internal_Use: 'Internal Use',
};

const normalizeReasonFromBackend = (reason: unknown): Transaction['reason'] | undefined => {
  if (typeof reason !== 'string') return undefined;
  const mapped = reasonFromBackend[reason] ?? reason;
  return mapped as Transaction['reason'];
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
      if (!res.ok) {
        throw new Error(await readErrorMessage(res, 'Failed to fetch transactions'));
      }
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.items || []);
      return items.map((tx: Transaction) => ({
        ...tx,
        reason: normalizeReasonFromBackend(tx.reason),
      }));
    },
    create: async (tx: Partial<Transaction>): Promise<Transaction> => {
      const payload = {
        productId: tx.productId != null ? String(tx.productId) : undefined,
        type: tx.type,
        quantity: tx.quantity != null ? Number(tx.quantity) : undefined,
        reason: tx.reason ? (reasonToBackend[String(tx.reason)] ?? String(tx.reason)) : undefined,
        unitPrice: tx.unitPrice != null ? Number(tx.unitPrice) : undefined,
        unitCost: tx.unitCost != null ? Number(tx.unitCost) : undefined,
        customer: tx.customer,
        supplier: tx.supplier,
        notes: tx.notes,
        date: tx.date,
      };
      const sanitizedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ''),
      );

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(sanitizedPayload),
      });
      if (!res.ok) {
        throw new Error(await readErrorMessage(res, 'Failed to create transaction'));
      }
      const created = await res.json();
      return {
        ...created,
        reason: normalizeReasonFromBackend(created.reason),
      };
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

  companies: {
    create: async (data: { name: string; industry?: string; logoUrl?: string }): Promise<Company> => {
      const res = await fetch(`${API_BASE}/companies`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to create company'));
      return res.json();
    },
    getMine: async (): Promise<Company | null> => {
      const res = await fetch(`${API_BASE}/companies/mine`, { headers: await getHeaders() });
      if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch company'));
      return res.json();
    },
    updateMine: async (data: Partial<Pick<Company, 'name' | 'industry' | 'logoUrl'>>): Promise<Company> => {
      const res = await fetch(`${API_BASE}/companies/mine`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to update company'));
      return res.json();
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
