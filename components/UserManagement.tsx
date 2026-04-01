
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { UserPlus, Edit2, Trash2, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Partial<User>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.USER,
    status: 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({ ...formData });
    setShowAddForm(false);
    setFormData({ name: '', email: '', password: '', role: UserRole.USER, status: 'Active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">User Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Control system access levels and permissions</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-lg"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-blue-100 dark:border-blue-900/40 shadow-sm animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 dark:text-white"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 dark:text-white"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Pass</label>
              <input 
                required
                type="password" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 dark:text-white"
                value={formData.password || ''}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="≥6 chars"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Role</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.ADMIN}>Administrator</option>
                <option value={UserRole.USER}>Staff / Clerk</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-900 text-white py-2 rounded-lg font-bold">Save</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2 rounded-lg font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{u.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Mail size={10} /> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Shield size={14} className={u.role === UserRole.ADMIN ? 'text-blue-900 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                    <span className={u.role === UserRole.ADMIN ? 'font-bold text-blue-900 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}>
                      {u.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1 text-xs font-bold uppercase ${
                    u.status === 'Active' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {u.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {u.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400 dark:text-slate-500">
                  {u.lastLogin || 'Never'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onUpdateUser({ ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' })}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                      title="Toggle Status"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(u.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
