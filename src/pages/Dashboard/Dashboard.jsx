import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { SummaryCards } from '../../components/cards/SummaryCards';
import { BalanceChart } from './BalanceChart';
import { SpendingChart } from './SpendingChart';
import { IncomeExpenseBarChart } from '../../components/charts/IncomeExpenseBarChart';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import  Progress  from '../../components/ui/Progress'; // We need this UI component! We'll make a custom inline one for now.

const ProgressBar = ({ value, max, colorClass }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

export const Dashboard = () => {
  const { transactions, budgets } = useFinanceStore();

  const { totalBalance, totalIncome, totalExpenses } = React.useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.totalIncome += curr.amount;
          acc.totalBalance += curr.amount;
        } else {
          acc.totalExpenses += curr.amount;
          acc.totalBalance -= curr.amount;
        }
        return acc;
      },
      { totalBalance: 0, totalIncome: 0, totalExpenses: 0 }
    );
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's an overview of your finances.</p>
      </div>

      <SummaryCards 
        totalBalance={totalBalance} 
        totalIncome={totalIncome} 
        totalExpenses={totalExpenses} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseBarChart transactions={transactions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Balance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <BalanceChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingChart transactions={transactions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Progress (This Month)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.slice(0, 4).map(budget => {
                const spent = currentMonthExpenses.filter(t => t.category === budget.category).reduce((a, b) => a + b.amount, 0);
                const perc = (spent / budget.limit) * 100;
                let color = 'bg-emerald-500';
                if (perc > 75) color = 'bg-amber-500';
                if (perc >= 100) color = 'bg-rose-500';

                return (
                  <div key={budget.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium dark:text-gray-200">{budget.category}</span>
                      <span className="text-gray-500 dark:text-gray-400">{formatCurrency(spent)} / {formatCurrency(budget.limit)}</span>
                    </div>
                    <ProgressBar value={spent} max={budget.limit} colorClass={color} />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map(t => (
                <div key={t.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-medium text-sm dark:text-gray-200">{t.category}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <div className={`font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
