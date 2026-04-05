import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export const BalanceChart = ({ transactions }) => {
  const data = useMemo(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    
    const result = [];
    for (const t of sortedTransactions) {
      if (t.type === 'income') {
        currentBalance += t.amount;
      } else {
        currentBalance -= t.amount;
      }
      result.push({
        name: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        balance: currentBalance
      });
    }
    return result;
  }, [transactions]);

  if (transactions.length === 0) return <div className="h-[200px] flex items-center justify-center text-gray-500">No data</div>;

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 0, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value)} width={60} />
          <Tooltip 
            formatter={(val) => formatCurrency(val)}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#000' }}
          />
          <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};