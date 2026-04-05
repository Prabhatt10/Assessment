import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { TransactionTable } from './TransactionTable';
import { TransactionFilters } from './TransactionFilters';
import { TransactionForm } from './TransactionForm';

export const Transactions = () => {
  const { role } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your income and expenses.</p>
        </div>
        
        {role === 'Admin' && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6">
        <TransactionFilters />
        <div className="mt-6">
          <TransactionTable />
        </div>
      </div>

      <TransactionForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
