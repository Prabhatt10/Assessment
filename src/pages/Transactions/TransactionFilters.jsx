import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';

const uniqueCategories = (transactions) => Array.from(new Set(transactions.map((t) => t.category)));

export const TransactionFilters = () => {
  const { filters, setFilters, transactions } = useFinanceStore();
  const categories = uniqueCategories(transactions);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
        <Select 
          value={filters.type} 
          onChange={(e) => setFilters({ type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
        <Select 
          value={filters.category} 
          onChange={(e) => setFilters({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Amount</label>
        <Input 
          type="number" 
          placeholder="Min $" 
          value={filters.amountRange.min || ''}
          onChange={(e) => setFilters({ amountRange: { ...filters.amountRange, min: e.target.value ? parseFloat(e.target.value) : null }})}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Amount</label>
        <Input 
          type="number" 
          placeholder="Max $" 
          value={filters.amountRange.max || ''}
          onChange={(e) => setFilters({ amountRange: { ...filters.amountRange, max: e.target.value ? parseFloat(e.target.value) : null }})}
        />
      </div>
    </div>
  );
};
