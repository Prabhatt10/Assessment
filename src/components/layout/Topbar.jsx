import React, { useState } from 'react';
import { Moon, Sun, Search, UserCircle2, Bell, Coins, Menu, X, Settings, LayoutDashboard, Receipt, PieChart, LineChart, Target } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const Topbar = () => {
  const { role, setRole, theme, toggleTheme, searchQuery, setSearchQuery, notifications, dismissNotification } = useFinanceStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search (Ctrl+K)..."
            className="pl-9 bg-gray-100/50 dark:bg-gray-900/50 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 transition-all focus:w-full h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="md:hidden flex bg-indigo-600 p-1.5 rounded-lg text-white">
          <span className="font-bold text-sm tracking-tight px-1">FinDash V3</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 md:gap-3">
        


        <div className="relative block">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="rounded-full relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-950" />
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <Motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950">
                  <h3 className="font-semibold dark:text-white">Notifications</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm dark:text-gray-200 font-medium">{n.message}</p>
                          <button onClick={() => dismissNotification(n.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">×</button>
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{formatDistanceToNow(new Date(n.date), { addSuffix: true })}</p>
                      </div>
                    ))
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-1 md:gap-2 border-l border-gray-200 dark:border-gray-800 pl-2 md:pl-4 ml-1">
          <UserCircle2 className="h-7 w-7 text-gray-400 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold leading-none hidden sm:block mb-1">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-xs text-indigo-600 font-semibold bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer dark:text-indigo-400"
            >
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(true)} className="md:hidden ml-1">
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-950 p-6 flex flex-col pt-12"
          >
            <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} className="absolute top-4 right-4">
              <X className="h-6 w-6" />
            </Button>
            
            <h2 className="text-2xl font-bold dark:text-white mb-6">Menu</h2>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Search</label>
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-9 bg-gray-100/50 dark:bg-gray-900/50 w-full h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Navigation</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
                    { name: 'Transactions', icon: Receipt, path: '/transactions' },
                    { name: 'Budgets', icon: PieChart, path: '/budgets' },
                    { name: 'Insights', icon: LineChart, path: '/insights' },
                    { name: 'Goals', icon: Target, path: '/goals' },
                    { name: 'Settings', icon: Settings, path: '/settings' },
                  ].map(page => (
                    <div 
                      key={page.path}
                      onClick={() => { setShowMobileMenu(false); navigate(page.path); }}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <page.icon className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-sm dark:text-gray-200">{page.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Role Switcher</label>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <span className="font-medium dark:text-white text-sm">Active Role</span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-transparent font-bold text-indigo-600 dark:text-indigo-400 border-none outline-none focus:ring-0 p-0 text-right"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
            </div>
            
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
