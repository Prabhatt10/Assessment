import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';
import { Plus } from 'lucide-react';

const CATEGORIES = ['Salary', 'Freelance', 'Groceries', 'Utilities', 'Dining', 'Entertainment', 'Transport', 'Other'];

export const Budgets = () => {
  const { budgets, setBudget, transactions, role } = useFinanceStore();
  const [newBudgetCategory, setNewBudgetCategory] = React.useState(CATEGORIES[0]);
  const [newBudgetLimit, setNewBudgetLimit] = React.useState('');

  const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth());

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudgetLimit && !isNaN(newBudgetLimit)) {
      setBudget(newBudgetCategory, parseFloat(newBudgetLimit));
      setNewBudgetLimit('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Budgets</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor your monthly spending limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === 'Admin' && (
          <Card className="md:col-span-1 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Set Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-200">Category</label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm hover:text-gray-700 focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:text-white dark:hover:text-gray-800 transition duration-200"
                    value={newBudgetCategory} 
                    onChange={e => setNewBudgetCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium dark:text-gray-200">Monthly Limit</label>
                  <Input type="number" min="0" step="1" required placeholder="500" value={newBudgetLimit} onChange={e => setNewBudgetLimit(e.target.value)} />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Plus className="h-4 w-4" /> Update Budget
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className={`space-y-4 ${role === 'Admin' ? 'md:col-span-2' : 'md:col-span-3'}`}>
          {budgets.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500">
              No budgets set.
            </div>
          ) : (
            budgets.map(budget => {
              const spent = currentMonthExpenses.filter(t => t.category === budget.category).reduce((a, b) => a + b.amount, 0);
              const percentage = Math.min(100, Math.max(0, (spent / budget.limit) * 100));
              let color = 'bg-emerald-500';
              if (percentage > 75) color = 'bg-amber-500';
              if (percentage >= 100) color = 'bg-rose-500';

              return (
                <Card key={budget.category} className={percentage >= 100 ? 'border-rose-200 dark:border-rose-900/50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg dark:text-white">{budget.category}</span>
                        {percentage >= 100 && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">EXCEEDED</span>}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold dark:text-white">{formatCurrency(spent)}</span>
                        <span className="text-gray-500 text-sm ml-1">/ {formatCurrency(budget.limit)}</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-3">
                      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>{spent > budget.limit ? 'Over budget by ' + formatCurrency(spent - budget.limit) : formatCurrency(budget.limit - spent) + ' remaining'}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};
