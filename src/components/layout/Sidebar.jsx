import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, LineChart, Wallet, PieChart, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Receipt, label: 'Transactions', path: '/transactions' },
  { icon: PieChart, label: 'Budgets', path: '/budgets' },
  { icon: LineChart, label: 'Insights', path: '/insights' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = ({ className }) => {
  return (
    <aside className={cn("flex flex-col w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 px-4 py-8 relative", className)}>
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="flex bg-indigo-600 p-2 rounded-lg text-white">
          <Wallet className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight dark:text-white">FinDash</span>
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

      <div className="absolute bottom-8 left-4 right-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">Pro Version</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Upgrade for more features</p>
        <button className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-medium transition-colors">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
};
