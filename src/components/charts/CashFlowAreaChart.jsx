import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const CashFlowAreaChart = ({ transactions }) => {
  const data = useMemo(() => {
    const monthlyData = {};
    
    // Simplistic monthly aggregation
    transactions.forEach(t => {
      const date = new Date(t.date);
      const m = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
      if (!monthlyData[m]) monthlyData[m] = { name: m, amount: 0, income: 0, expense: 0, order: date.getTime() };
      
      if (t.type === 'income') {
        monthlyData[m].income += t.amount;
        monthlyData[m].amount += t.amount;
      } else {
        monthlyData[m].expense += t.amount;
        monthlyData[m].amount -= t.amount;
      }
    });

    return Object.values(monthlyData).sort((a,b) => a.order - b.order).slice(-6);
  }, [transactions]);

  if (transactions.length === 0) return <div className="h-[200px] flex items-center justify-center text-gray-500">No data</div>;

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(val) => formatCurrency(val)}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#000' }}
          />
          <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
