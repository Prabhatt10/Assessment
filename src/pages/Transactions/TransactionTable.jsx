import React, { useState, useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Trash2, Edit2, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const TransactionTable = ({ onEdit }) => {
  const { transactions, filters, deleteTransaction, editTransaction, role, searchQuery } = useFinanceStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredAndSortedData = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(q) || 
        t.tags?.join(' ').toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    }

    // Role
    if (role === 'Viewer') {
      // Maybe hide sensitive data? Example only.
    }

    // Filters
    if (filters.type !== 'all') result = result.filter((t) => t.type === filters.type);
    if (filters.category !== 'all') result = result.filter((t) => t.category === filters.category);
    if (filters.amountRange.min) result = result.filter((t) => t.amount >= filters.amountRange.min);
    if (filters.amountRange.max) result = result.filter((t) => t.amount <= filters.amountRange.max);

    // Sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filters, sortConfig, searchQuery, role]);

  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const maxPage = Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize));

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditForm({ ...t, amount: t.amount.toString() });
  };

  const saveEdit = () => {
    editTransaction({
      ...editForm,
      amount: parseFloat(editForm.amount) || 0
    });
    setEditingId(null);
  };

  const requestSort = (key) => setSortConfig(c => ({ key, direction: c.key === key && c.direction === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 dark:bg-gray-950/50 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" onClick={() => requestSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3"/> : <ArrowDown className="inline w-3"/>)}
              </th>
              <th className="px-6 py-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" onClick={() => requestSort('category')}>
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3"/> : <ArrowDown className="inline w-3"/>)}
              </th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200" onClick={() => requestSort('amount')}>
                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <ArrowUp className="inline w-3"/> : <ArrowDown className="inline w-3"/>)}
              </th>
              {role !== 'Viewer' && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions found</td></tr>
            ) : (
              paginatedData.map((t) => {
                const isEditing = editingId === t.id;

                return (
                  <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group transition-colors">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {isEditing ? (
                         <input type="date" value={editForm.date.split('T')[0]} onChange={e => setEditForm({...editForm, date: new Date(e.target.value).toISOString()})} className="bg-white dark:bg-gray-800 border rounded px-1"/>
                      ) : formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                      {isEditing ? (
                         <input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="bg-white dark:bg-gray-800 border rounded px-1 w-24"/>
                      ) : t.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {t.tags?.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                      {isEditing ? (
                         <input type="number" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} className="bg-white dark:bg-gray-800 border rounded px-1 w-20"/>
                      ) : (t.type === 'income' ? '+' : '-') + formatCurrency(t.amount)}
                    </td>
                    {role !== 'Viewer' && (
                      <td className="px-6 py-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <>
                            <button onClick={saveEdit} className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-md transition-colors"><Check className="h-4 w-4" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"><X className="h-4 w-4" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(t)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"><Edit2 className="h-4 w-4" /></button>
                            {role === 'Admin' && (
                               <button onClick={() => deleteTransaction(t.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length > pageSize && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500">
          <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries</span>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50 dark:bg-gray-800">Prev</button>
            <button disabled={currentPage === maxPage} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50 dark:bg-gray-800">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};
