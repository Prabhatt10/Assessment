import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, Receipt, PieChart, Target, LineChart, Settings, PlusCircle, Shield } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Modal } from '../ui/Modal';
import { TransactionForm } from '../../pages/Transactions/TransactionForm';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [addTxOpen, setAddTxOpen] = useState(false);
  const navigate = useNavigate();
  const { setRole } = useFinanceStore();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Modal isOpen={open} onClose={() => setOpen(false)} className="p-0 border-0 overflow-hidden bg-transparent shadow-2xl max-w-2xl w-full mx-auto align-top mt-[10vh]" hideHeader>
        <Command className="flex flex-col w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <Command.Input 
              placeholder="Type a command or search..." 
              autoFocus
              className="w-full bg-transparent border-0 h-14 outline-none p-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400" 
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="p-4 text-center text-sm text-gray-500">No results found.</Command.Empty>
            
            <Command.Group heading={<span className="text-xs font-semibold text-gray-500 px-2 py-1 block">Actions</span>}>
              <Command.Item 
                onSelect={() => runCommand(() => setAddTxOpen(true))}
                className="flex items-center px-2 py-3 rounded-lg cursor-pointer text-sm gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 w-full"
              >
                <PlusCircle className="w-4 h-4" /> Add Transaction
              </Command.Item>
            </Command.Group>

            <Command.Group heading={<span className="text-xs font-semibold text-gray-500 px-2 py-1 block mt-2">Navigation</span>}>
              {[
                { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
                { name: 'Transactions', icon: Receipt, path: '/transactions' },
                { name: 'Budgets', icon: PieChart, path: '/budgets' },
                { name: 'Insights', icon: LineChart, path: '/insights' },
                { name: 'Goals', icon: Target, path: '/goals' },
                { name: 'Settings', icon: Settings, path: '/settings' },
              ].map(page => (
                <Command.Item 
                  key={page.path}
                  onSelect={() => runCommand(() => navigate(page.path))}
                  className="flex items-center px-2 py-3 rounded-lg cursor-pointer text-sm gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 w-full"
                >
                  <page.icon className="w-4 h-4" /> Go to {page.name}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading={<span className="text-xs font-semibold text-gray-500 px-2 py-1 block mt-2">Roles</span>}>
              {['Admin', 'Viewer'].map(role => (
                <Command.Item 
                  key={role}
                  onSelect={() => runCommand(() => setRole(role))}
                  className="flex items-center px-2 py-3 rounded-lg cursor-pointer text-sm gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 w-full"
                >
                  <Shield className="w-4 h-4" /> Switch to {role} mode
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </Modal>

      <TransactionForm isOpen={addTxOpen} onClose={() => setAddTxOpen(false)} />
    </>
  );
};
