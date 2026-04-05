import React, { useState } from 'react';
import { Moon, Sun, Search, UserCircle2, Bell } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export const Topbar = () => {
  const { role, setRole, theme, toggleTheme, searchQuery, setSearchQuery, notifications, dismissNotification } = useFinanceStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Global search..."
            className="pl-9 bg-gray-100/50 dark:bg-gray-900/50 border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 transition-all focus:w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="rounded-full relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-950" />
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
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
                          <p className="text-sm dark:text-gray-200">{n.message}</p>
                          <button onClick={() => dismissNotification(n.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">×</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(n.date), { addSuffix: true })}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-4 ml-1">
          <UserCircle2 className="h-8 w-8 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium dark:text-gray-200 leading-none">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-xs text-indigo-600 mt-1 font-semibold bg-transparent border-none outline-none focus:ring-0 p-0 cursor-pointer dark:text-indigo-400"
            >
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
