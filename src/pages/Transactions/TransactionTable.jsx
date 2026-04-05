import React, { useMemo, useState } from 'react';
import { Edit2, Trash2, ArrowUpDown, Tag } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TransactionForm } from './TransactionForm';
import { useDebounce } from '../../hooks/useDebounce';

export const TransactionTable = () => {
  const { transactions, role, searchQuery, filters, deleteTransaction, bulkDeleteTransactions } = useFinanceStore();
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t) =>
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    if (filters.type !== 'all') result = result.filter((t) => t.type === filters.type);
    if (filters.category !== 'all') result = result.filter((t) => t.category === filters.category);
    if (filters.amountRange.min !== null) result = result.filter((t) => t.amount >= filters.amountRange.min);
    if (filters.amountRange.max !== null) result = result.filter((t) => t.amount <= filters.amountRange.max);

    return result.sort((a, b) => {
      if (sortConfig.key === 'date') return sortConfig.direction === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      if (sortConfig.key === 'amount') return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      return 0;
    });
  }, [transactions, debouncedSearch, filters, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedTransactions.length) setSelectedIds([]);
    else setSelectedIds(filteredAndSortedTransactions.map(t => t.id));
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const performBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} transactions?`)) {
      bulkDeleteTransactions(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && role === 'Admin' && (
        <div className="bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 p-3 flex justify-between items-center rounded-lg">
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
            {selectedIds.length} items selected
          </span>
          <Button variant="destructive" size="sm" onClick={performBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {role === 'Admin' && (
              <TableHead className="w-12">
                <input type="checkbox" checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0} onChange={toggleSelectAll} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </TableHead>
            )}
            <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
              <div className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort('amount')}>
              <div className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="h-3 w-3" /></div>
            </TableHead>
            {role === 'Admin' && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={role === 'Admin' ? 7 : 6} className="text-center py-8 text-gray-500">
                No matching transactions found.
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedTransactions.map((t) => (
              <TableRow key={t.id} className="group">
                {role === 'Admin' && (
                  <TableCell>
                    <input type="checkbox" checked={selectedIds.includes(t.id)} onChange={() => toggleSelect(t.id)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </TableCell>
                )}
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell className="font-medium">
                  {t.category} 
                  {t.isRecurring && <Tag className="inline h-3 w-3 ml-1 text-indigo-500" title="Recurring"/>}
                </TableCell>
                <TableCell>
                  <Badge variant={t.type === 'income' ? 'success' : 'danger'}>
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {t.tags && t.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </TableCell>
                {role === 'Admin' && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => setEditingTransaction(t)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => deleteTransaction(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TransactionForm isOpen={!!editingTransaction} onClose={() => setEditingTransaction(null)} initialData={editingTransaction} />
    </div>
  );
};
