import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Target, Plus } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const Goals = () => {
  const { goals, addGoal, deleteGoal, updateGoalProgress, role } = useFinanceStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    addGoal({
      title: newGoal.title,
      target: parseFloat(newGoal.target),
      deadline: new Date(newGoal.deadline).toISOString()
    });
    setShowAdd(false);
    setNewGoal({ title: '', target: '', deadline: '' });
  };

  const handleProgressUpdate = (id, amountStr) => {
    const val = parseFloat(amountStr);
    if (!isNaN(val)) {
      updateGoalProgress(id, val);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">Financial Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your path to big milestones.</p>
        </div>
        
        {role !== 'Viewer' && (
          <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        )}
      </div>

      {showAdd && role !== 'Viewer' && (
        <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-semibold dark:text-gray-300 uppercase">Goal Name</label>
                <Input required value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="Emergency Fund" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold dark:text-gray-300 uppercase">Target Amount</label>
                <Input type="number" required min="1" value={newGoal.target} onChange={e => setNewGoal({ ...newGoal, target: e.target.value })} placeholder="10000" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold dark:text-gray-300 uppercase">Deadline</label>
                <Input type="date" required value={newGoal.deadline} onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })} />
              </div>
              <Button type="submit">Save Goal</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No active goals</p>
            <p className="text-sm mt-1">Setup your first goal to start tracking progress.</p>
          </div>
        ) : (
          goals.map(goal => {
            const percentage = Math.min(100, (goal.current / goal.target) * 100);
            const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
            const isCompleted = percentage >= 100;
            const colorClass = isCompleted ? 'bg-emerald-500' : 'bg-indigo-500';

            return (
              <Card key={goal.id} className={isCompleted ? 'border-emerald-200 dark:border-emerald-800/50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                        {goal.title}
                        {isCompleted && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Met</span>}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 flex gap-2">
                        <span>Target: {formatDate(goal.deadline)}</span>
                        <span>•</span>
                        <span className={daysLeft < 0 && !isCompleted ? 'text-rose-500 font-bold' : ''}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                      </p>
                    </div>
                    {role === 'Admin' && (
                      <button onClick={() => deleteGoal(goal.id)} className="text-gray-400 hover:text-rose-500 text-xs">Remove</button>
                    )}
                  </div>

                  <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2 relative">
                    <div className={`h-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-medium dark:text-gray-200 group">
                    <div className="flex items-center gap-2">
                      {role !== 'Viewer' ? (
                        <input 
                          type="number" 
                          value={goal.current || ''}
                          className="w-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                          onChange={(e) => handleProgressUpdate(goal.id, e.target.value)}
                        />
                      ) : (
                        <span>{formatCurrency(goal.current)}</span>
                      )}
                      <span className="text-gray-500">/ {formatCurrency(goal.target)}</span>
                    </div>
                    <span className="text-gray-500 font-bold">{percentage.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
