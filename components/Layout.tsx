
import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  BarChart3, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Wifi, 
  WifiOff,
  Bell,
  Sun,
  Moon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: any;
  onLogout: () => void;
  isOffline: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activePage, 
  setActivePage, 
  currentUser, 
  onLogout, 
  isOffline,
  theme,
  toggleTheme
}) => {
  // Sidebar defaults to open on desktop, but we handle mobile overlay logic carefully.
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 768);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.USER] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: [UserRole.ADMIN, UserRole.USER] },
    { id: 'stock-in', label: 'Stock In', icon: ArrowDownLeft, roles: [UserRole.ADMIN] },
    { id: 'stock-out', label: 'Stock Out', icon: ArrowUpRight, roles: [UserRole.ADMIN, UserRole.USER] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: [UserRole.ADMIN] },
    { id: 'users', label: 'Users', icon: Users, roles: [UserRole.ADMIN] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  const handleNavClick = (id: string) => {
    setActivePage(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Sidebar Overlay: Only show when sidebar is OPEN on mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-30 h-full bg-[#1e3a8a] dark:bg-slate-900 text-white transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-blue-800 dark:border-slate-800">
          <div className={`flex items-center gap-3 font-bold text-xl overflow-hidden transition-opacity duration-300 ${!isSidebarOpen && 'md:opacity-0'}`}>
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-blue-900 font-black">S</span>
            </div>
            <span className="whitespace-nowrap">StockPulse</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-blue-100 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-4 w-full p-3 rounded-lg transition-all group ${
                activePage === item.id 
                ? 'bg-blue-800 dark:bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'hover:bg-blue-800/50 dark:hover:bg-slate-800 text-blue-100 hover:text-white'
              } ${!isSidebarOpen && 'md:justify-center'}`}
            >
              <item.icon size={22} className={`transition-transform duration-300 ${activePage === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'md:hidden opacity-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-800 dark:border-slate-800">
          <button 
            onClick={onLogout}
            className={`flex items-center gap-4 w-full p-3 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition-all group ${!isSidebarOpen && 'md:justify-center'}`}
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'md:hidden opacity-0'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white capitalize transition-all">
              {activePage.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isOffline ? (
              <div className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full text-xs font-semibold border border-orange-100 dark:border-orange-900/30">
                <WifiOff size={14} />
                <span className="hidden sm:inline">Offline Mode</span>
                <span className="sm:hidden">Offline</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs font-semibold border border-green-100 dark:border-green-900/30">
                <Wifi size={14} />
                <span className="hidden sm:inline">Online</span>
              </div>
            )}
            
            <button className="p-2 text-slate-400 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div ref={profileRef} className="relative pl-4 border-l border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 p-1 -m-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-full flex items-center justify-center font-bold shadow-inner ring-2 ring-white dark:ring-slate-800">
                  {currentUser.name.charAt(0)}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => console.log('My Profile clicked')}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
