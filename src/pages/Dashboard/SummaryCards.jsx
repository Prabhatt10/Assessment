import React from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/formatters';

export const SummaryCards = ({ totalBalance, totalIncome, totalExpenses }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{formatCurrency(totalBalance)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+20.1% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+12.5% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold dark:text-white">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+4.3% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};
