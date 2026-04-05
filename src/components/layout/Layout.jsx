import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ActualSidebar, MobileBottomNav } from './Sidebar';
import { Topbar } from './Topbar';
import { useFinanceStore } from '../../store/useFinanceStore';
import { CommandPalette } from '../modals/CommandPalette';

export const Layout = () => {
  const { theme } = useFinanceStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <ActualSidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden pb-16 md:pb-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <CommandPalette />
    </div>
  );
};
