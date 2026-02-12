
import { User, UserRole, Product, Transaction, TransactionType, StockOutReason } from './types';

const STORAGE_KEY = 'stockpulse_db_v1';

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@stockpulse.com', role: UserRole.ADMIN, status: 'Active' },
  { id: 'u2', name: 'Staff Member', email: 'staff@stockpulse.com', role: UserRole.STAFF, status: 'Active' }
];

function generateMockProducts(): Product[] {
  const products: Product[] = [];
  const items = [
    { name: 'Basmati Rice 5kg', cat: 'Food & Beverages', cost: 12.50, sell: 18.00, supplier: 'Global Distro', unit: 'box' },
    { name: 'Sunflower Oil 2L', cat: 'Food & Beverages', cost: 4.20, sell: 7.50, supplier: 'Local Co-op', unit: 'pcs' },
    { name: 'Dish Soap XL', cat: 'Household', cost: 2.10, sell: 4.50, supplier: 'QuickSupply Ltd', unit: 'pcs' },
    { name: 'AA Batteries (4pk)', cat: 'Electronics', cost: 1.50, sell: 3.99, supplier: 'Elite Imports', unit: 'pk' },
    { name: 'Ballpoint Pens (12pk)', cat: 'Stationery', cost: 0.80, sell: 2.50, supplier: 'Elite Imports', unit: 'pk' },
  ];

  for (let i = 0; i < 50; i++) {
    const template = items[i % items.length];
    products.push({
      id: `p${i}`,
      name: `${template.name} #${i + 1}`,
      sku: `${template.cat.substring(0, 3).toUpperCase()}-${1000 + i}`,
      category: template.cat,
      costPrice: template.cost,
      sellingPrice: template.sell,
      quantity: Math.floor(Math.random() * 100),
      reorderLevel: 15,
      supplierName: template.supplier,
      image: `https://picsum.photos/seed/${i}/200`,
      unit: template.unit,
      status: 'Published'
    });
  }
  return products;
}

function generateMockTransactions(products: Product[], users: User[]): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const date = new Date(now.getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000));
    
    const isOut = Math.random() > 0.3;
    transactions.push({
      id: `t${i}`,
      productId: product.id,
      productName: product.name,
      type: isOut ? TransactionType.STOCK_OUT : TransactionType.STOCK_IN,
      quantity: Math.floor(Math.random() * 10) + 1,
      reason: isOut ? StockOutReason.SALE : undefined,
      unitPrice: isOut ? product.sellingPrice : undefined,
      unitCost: !isOut ? product.costPrice : undefined,
      userId: user.id,
      userName: user.name,
      date: date.toISOString(),
    });
  }
  return transactions;
}

export const loadDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);

  const products = generateMockProducts();
  const transactions = generateMockTransactions(products, INITIAL_USERS);
  
  const initialState = {
    currentUser: null,
    products,
    transactions,
    users: INITIAL_USERS,
    isOffline: false
  };
  
  saveDB(initialState);
  return initialState;
};

export const saveDB = (state: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
