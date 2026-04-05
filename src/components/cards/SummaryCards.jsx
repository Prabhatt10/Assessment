import React from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';

export const SummaryCards = ({ totalBalance, totalIncome, totalExpenses }) => {
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{formatCurrency(totalBalance)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current total</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{formatCurrency(totalIncome)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>

      <Card className={savingsRate > 20 ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${savingsRate > 20 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>Savings Rate</CardTitle>
          <PiggyBank className={`h-4 w-4 ${savingsRate > 20 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${savingsRate > 20 ? 'text-indigo-900 dark:text-indigo-100' : 'dark:text-white'}`}>{savingsRate}%</div>
          <p className={`text-xs mt-1 ${savingsRate > 20 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {savingsRate > 20 ? 'Great job saving! 🎉' : 'Aim for > 20%'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
