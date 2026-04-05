import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, LineChart, Target, Settings, Trophy } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useFinanceStore } from '../../store/useFinanceStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Receipt, label: 'Transactions', path: '/transactions' },
  { icon: PieChart, label: 'Budgets', path: '/budgets' },
  { icon: LineChart, label: 'Insights', path: '/insights' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Topbar = React.lazy(() => import('./Topbar').then(m => ({ default: m.Topbar })));
export const Sidebar = React.lazy(() => import('./Sidebar').then(m => ({ default: m.Sidebar })));

// The actual Sidebar Component
export const ActualSidebar = ({ className }) => {
  const { achievements } = useFinanceStore();
  return (
    <aside className={cn("flex flex-col w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 px-4 py-8 relative", className)}>
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="flex bg-indigo-600 p-2 rounded-lg text-white">
          <PieChart className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight dark:text-white">FinDash V3</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {achievements.length > 0 && (
        <div className="absolute bottom-8 left-4 right-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Achievements</p>
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{achievements.length} Unlocked</p>
        </div>
      )}
    </aside>
  );
};

export const MobileBottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-40 flex items-center justify-around px-2 pb-safe">
      {navItems.slice(0, 5).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              isActive 
                ? "text-indigo-600 dark:text-indigo-400" 
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            )
          }
        >
          <item.icon className="h-5 w-5 mb-1" />
          <span className="text-[10px] scale-90">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
