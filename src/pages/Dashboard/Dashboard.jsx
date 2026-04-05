import React from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { SummaryCards } from '../../components/cards/SummaryCards';
import { BalanceChart } from '../../components/charts/BalanceChart';
import { SpendingChart } from '../../components/charts/SpendingChart';
import { IncomeExpenseBarChart } from '../../components/charts/IncomeExpenseBarChart';
import { CashFlowAreaChart } from '../../components/charts/CashFlowAreaChart';
import { formatCurrency, formatDate } from '../../utils/formatters';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableWidget } from '../../components/ui/SortableWidget';

const ProgressBar = ({ value, max, colorClass }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

export const Dashboard = () => {
  const { transactions, budgets, dashboardLayout, setDashboardLayout } = useFinanceStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = dashboardLayout.indexOf(active.id);
      const newIndex = dashboardLayout.indexOf(over.id);
      setDashboardLayout(arrayMove(dashboardLayout, oldIndex, newIndex));
    }
  };

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

  const getWidget = (id) => {
    switch(id) {
      case 'summary':
        return <SummaryCards totalBalance={totalBalance} totalIncome={totalIncome} totalExpenses={totalExpenses} />;
      case 'cashflow':
        return (
          <Card className="h-full">
            <CardHeader><CardTitle>Cash Flow</CardTitle></CardHeader>
            <CardContent><CashFlowAreaChart transactions={transactions} /></CardContent>
          </Card>
        );
      case 'balanceTrend':
        return (
          <Card className="h-full">
            <CardHeader><CardTitle>Balance Trend</CardTitle></CardHeader>
            <CardContent><BalanceChart transactions={transactions} /></CardContent>
          </Card>
        );
      case 'incomeVsExpense':
        return (
          <Card className="h-full">
            <CardHeader><CardTitle>Income vs Expense</CardTitle></CardHeader>
            <CardContent><IncomeExpenseBarChart transactions={transactions} /></CardContent>
          </Card>
        );
      case 'spendingByCategory':
        return (
          <Card className="h-full">
            <CardHeader><CardTitle>Spending Category</CardTitle></CardHeader>
            <CardContent><SpendingChart transactions={transactions} /></CardContent>
          </Card>
        );
      case 'budgetProgress':
        return (
          <Card className="h-full">
            <CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader>
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
        );
      case 'recentTransactions':
        return (
           <Card className="h-full">
            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map(t => (
                <div key={t.id} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm dark:text-gray-200">{t.category}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <div className={`font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      default: return null;
    }
  };

  const displayLayout = dashboardLayout.includes('incomeVsExpense') ? dashboardLayout : [...dashboardLayout, 'incomeVsExpense'];

  return (
    <div className="space-y-6 pb-20 md:pb-0 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Drag and drop to customize your view.</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={displayLayout} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {displayLayout.map(id => {
              if (id === 'summary') {
                 // Summary cards are best kept horizontally wide
                 return (
                   <SortableWidget key={id} id={id} className="xl:col-span-3">
                     {getWidget(id)}
                   </SortableWidget>
                 )
              }
              if (id === 'cashflow' || id === 'balanceTrend' || id === 'incomeVsExpense') {
                 // Double wide
                 return (
                   <SortableWidget key={id} id={id} className="xl:col-span-2">
                     {getWidget(id)}
                   </SortableWidget>
                 )
              }
              return (
                <SortableWidget key={id} id={id} className="xl:col-span-1">
                  {getWidget(id)}
                </SortableWidget>
              )
            })}

          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
