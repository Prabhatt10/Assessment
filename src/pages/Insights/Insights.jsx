import React, { useMemo } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { TrendingDown, TrendingUp, AlertCircle, Calendar, HeartPulse, Repeat } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { subDays, format, differenceInDays } from 'date-fns';

const HeatmapCalendar = ({ transactions }) => {
  const days = 90; // Last 90 days roughly acts as a nice grid 
  const today = new Date();
  
  const heatmapData = useMemo(() => {
    const data = {};
    for (let i = 0; i < days; i++) {
       data[format(subDays(today, i), 'yyyy-MM-dd')] = 0;
    }
    
    transactions.forEach(t => {
      const d = format(new Date(t.date), 'yyyy-MM-dd');
      if (data[d] !== undefined && t.type === 'expense') {
        data[d] += t.amount;
      }
    });
    return data;
  }, [transactions]);

  const maxExpense = Math.max(...Object.values(heatmapData), 1);

  return (
    <div className="flex flex-wrap gap-1 mt-4">
      {Object.entries(heatmapData).reverse().map(([dateStr, amount]) => {
        let intensity = 0;
        if (amount > 0) intensity = Math.max(1, Math.ceil((amount / maxExpense) * 4));
        
        const colors = [
          'bg-gray-100 dark:bg-gray-800', // 0
          'bg-rose-200 dark:bg-rose-900/40', // 1
          'bg-rose-300 dark:bg-rose-800/60', // 2
          'bg-rose-400 dark:bg-rose-700/80', // 3
          'bg-rose-500 dark:bg-rose-600',    // 4
        ];
        
        return (
          <div 
            key={dateStr} 
            title={`${dateStr}: ${formatCurrency(amount)}`}
            className={`w-4 h-4 rounded-sm ${colors[intensity]} transition-colors hover:ring-2 ring-indigo-400`}
          />
        );
      })}
    </div>
  );
}

export const Insights = () => {
  const { transactions } = useFinanceStore();

  const insightsData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
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

    // Detect subscriptions algorithm
    const possibleSubscriptions = [];
    expenses.forEach(e => {
       const exactMatches = expenses.filter(x => x.category === e.category && x.amount === e.amount);
       if (exactMatches.length >= 2) {
          // Are they sorted around 30 days apart roughly? Check the distance between them.
          const d1 = new Date(exactMatches[0].date);
          const d2 = new Date(exactMatches[1].date);
          const diff = Math.abs(differenceInDays(d1, d2));
          if (diff >= 28 && diff <= 31 && !possibleSubscriptions.find(s => s.amount === e.amount && s.category === e.category)) {
             possibleSubscriptions.push(e);
          }
       }
    });

    // Health Score
    const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncomeAmount = income.reduce((acc, curr) => acc + curr.amount, 0);
    const savingsRate = totalIncomeAmount > 0 ? ((totalIncomeAmount - totalExpenseAmount)/totalIncomeAmount) * 100 : 0;
    
    let healthScore = 0;
    if (totalIncomeAmount > 0) healthScore += 30; 
    if (savingsRate > 20) healthScore += 50;
    else if (savingsRate > 0) healthScore += 25;
    if (monthOverMonthChange <= 0) healthScore += 20;

    let message = "Your finances are tracking well.";
    if (totalExpenseAmount > totalIncomeAmount) message = "Warning: your lifetime expenses strictly exceed your income!";
    else if (savingsRate > 20) message = "Great job! A healthy savings rate gives you a huge safety net.";

    return {
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null,
      totalCount,
      monthOverMonthChange,
      message,
      currentMonthExpense,
      healthScore: Math.max(0, Math.min(100, Math.round(healthScore))),
      possibleSubscriptions
    };
  }, [transactions]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Insights Engine</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Deep analytics across your accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Health Score</CardTitle>
            <HeartPulse className="h-4 w-4 text-indigo-100" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{insightsData.healthScore}<span className="text-xl text-indigo-200">/100</span></div>
            <p className="text-xs text-indigo-200 mt-2 font-medium">
              {insightsData.healthScore >= 80 ? 'Excellent Standing' : insightsData.healthScore >= 50 ? 'Fair' : 'Needs Attention'}
            </p>
          </CardContent>
        </Card>

        {/* Similar Top Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Largest Category</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {insightsData.highestCategory ? (
              <>
                <div className="text-2xl font-bold dark:text-white">{insightsData.highestCategory.name}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatCurrency(insightsData.highestCategory.amount)} lifetime</p>
              </>
            ) : (
              <div className="text-lg text-gray-500">No data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Delta</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Entries</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{insightsData.totalCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lifetime log</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2"><Calendar className="h-5 w-5"/> Expense Heatmap (90 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <HeatmapCalendar transactions={transactions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2"><AlertCircle className="h-5 w-5"/> Smart Output</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {insightsData.message} 
              {" "}You are predominantly spending on <strong>{insightsData.highestCategory?.name || 'various categories'}</strong>. 
            </p>

            {insightsData.possibleSubscriptions.length > 0 && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-lg">
                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2 mb-2">
                  <Repeat className="h-4 w-4" /> Detected Subscriptions
                </h4>
                {insightsData.possibleSubscriptions.map(s => (
                  <div key={s.id} className="flex justify-between text-xs text-rose-700 dark:text-rose-200 py-1 border-b border-rose-100/50 dark:border-rose-800/50 last:border-0">
                    <span>{s.category} ({s.tags?.join(', ') || 'untagged'})</span>
                    <span className="font-bold">{formatCurrency(s.amount)}/mo</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
