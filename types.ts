
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export enum TransactionType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT'
}

export enum StockOutReason {
  SALE = 'Sale',
  DAMAGED = 'Damaged',
  EXPIRED = 'Expired',
  THEFT = 'Theft/Loss',
  SAMPLE = 'Sample/Giveaway',
  INTERNAL = 'Internal Use'
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface Product {
  id: string | number;
  name: string;
  sku: string;
  category: string;
  description?: string;
  image?: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  reorderLevel: number;
  supplierName: string;
  supplierContact?: string;
  location?: string;
  unit: string; // New field
  status: 'Published' | 'Draft'; // New field
}

export interface Transaction {
  id: string | number;
  productId: string | number;
  productName: string;
  type: TransactionType;
  quantity: number;
  unitPrice?: number;
  unitCost?: number;
  reason?: StockOutReason;
  customer?: string;
  supplier?: string;
  notes?: string;
  date: string;
  userId: string;
  userName: string;
}

export interface AppState {
  currentUser: User | null;
  products: Product[];
  transactions: Transaction[];
  users: User[];
  isOffline: boolean;
}
