
import { User, UserRole } from './types';

const STORAGE_KEY = 'stockpulse_db_v2';

// Default users required for authentication - these are system accounts, not inventory data
const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@stockpulse.com', role: UserRole.ADMIN, status: 'Active' },
  { id: 'u2', name: 'Staff Member', email: 'staff@stockpulse.com', role: UserRole.STAFF, status: 'Active' }
];

export const loadDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);

  // Initialize with empty arrays - no mock/dummy data
  const initialState = {
    currentUser: null,
    products: [],
    transactions: [],
    users: DEFAULT_USERS,
    isOffline: false
  };
  
  saveDB(initialState);
  return initialState;
};

export const saveDB = (state: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
