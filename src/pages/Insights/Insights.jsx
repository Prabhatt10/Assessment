import React, { useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { TrendingDown, TrendingUp, AlertCircle, Calendar, HeartPulse } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Insights = () => {
  const { transactions } = useFinanceStore();

  const insightsData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    // Total transactions
    const totalCount = transactions.length;

    // Highest spending category
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // Current vs previous month logic
    const currentMonth = new Date().getMonth();
    let currentMonthExpense = 0;
    let prevMonthExpense = 0;
    
    expenses.forEach(e => {
      const month = new Date(e.date).getMonth();
      if (month === currentMonth) currentMonthExpense += e.amount;
      else if (month === currentMonth - 1 || (currentMonth === 0 && month === 11)) prevMonthExpense += e.amount;
    });

    const monthOverMonthChange = prevMonthExpense === 0 
      ? 0 
      : ((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 100;

    // Financial Health Score (0-100)
    // Basic Algo: 50 points for savings rate > 20%, 30 points if income > 0, 20 points if monthOverMonth trend is decreasing
    const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncomeAmount = income.reduce((acc, curr) => acc + curr.amount, 0);
    const savingsRate = totalIncomeAmount > 0 ? ((totalIncomeAmount - totalExpenseAmount)/totalIncomeAmount) * 100 : 0;
    
    let healthScore = 0;
    if (totalIncomeAmount > 0) healthScore += 30; // Has income stream
    if (savingsRate > 20) healthScore += 50;
    else if (savingsRate > 0) healthScore += 25;
    if (monthOverMonthChange <= 0) healthScore += 20;

    let message = "Your finances look stable.";
    if (totalExpenseAmount > totalIncomeAmount) message = "Warning: your lifetime expenses strictly exceed your income!";
    else if (savingsRate > 20) message = "Great job! A healthy savings rate gives you a huge safety net.";

    return {
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null,
      totalCount,
      monthOverMonthChange,
      message,
      currentMonthExpense,
      healthScore: Math.max(0, Math.min(100, Math.round(healthScore)))
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Analytics and summaries based on your history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <Card className="bg-indigo-600 border-indigo-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Health Score</CardTitle>
            <HeartPulse className="h-4 w-4 text-indigo-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{insightsData.healthScore}<span className="text-xl text-indigo-200">/100</span></div>
            <p className="text-xs text-indigo-200 mt-1">
              {insightsData.healthScore >= 80 ? 'Excellent' : insightsData.healthScore >= 50 ? 'Fair' : 'Needs Attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Spending</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {insightsData.highestCategory ? (
              <>
                <div className="text-2xl font-bold dark:text-white">{insightsData.highestCategory.name}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatCurrency(insightsData.highestCategory.amount)} total lifetime</p>
              </>
            ) : (
              <div className="text-lg text-gray-500">No data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{formatCurrency(insightsData.currentMonthExpense)}</div>
            <div className="flex items-center text-xs mt-1">
              {insightsData.monthOverMonthChange > 0 ? (
                <span className="text-rose-500 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> {insightsData.monthOverMonthChange.toFixed(1)}%</span>
              ) : (
                <span className="text-emerald-500 flex items-center"><TrendingDown className="h-3 w-3 mr-1"/> {Math.abs(insightsData.monthOverMonthChange).toFixed(1)}%</span>
              )}
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{insightsData.totalCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lifetime operations</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Smart Analysis</h2>
        <Card className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle className="text-lg font-medium text-indigo-800 dark:text-indigo-300">Financial Check-up</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed text-sm md:text-base">
              {insightsData.message} 
              {" "}You are predominantly spending on <strong>{insightsData.highestCategory?.name || 'various categories'}</strong>. 
              {insightsData.healthScore > 75 
                ? " You're in a great position. Consider investing your excess liquidity to fight inflation." 
                : " Try looking closely at your highest spending category to see if there are easily removable excess subscriptions."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
