import React, { useMemo } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export const IncomeExpenseBarChart = ({ transactions }) => {
  const data = useMemo(() => {
    const monthlyData = {};
    
    transactions.forEach(t => {
      const dbDate = new Date(t.date);
      const month = dbDate.toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month, Income: 0, Expense: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].Income += t.amount;
      } else {
        monthlyData[month].Expense += t.amount;
      }
    });

    // Sort by actual month order theoretically or just reverse to show latest (simplification)
    return Object.values(monthlyData).reverse().slice(0, 6); // Last 6 months
  }, [transactions]);

  if (transactions.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>;
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Tooltip 
            cursor={{fill: '#f3f4f6', opacity: 0.4}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#000' }}
          />
          <Legend />
          <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
