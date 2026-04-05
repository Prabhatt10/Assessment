import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions, mockBudgets } from '../data/mockData';

const ACHIEVEMENTS_LIST = [
  { id: 'first_transaction', title: 'First Steps', description: 'Log your first transaction', threshold: 1, type: 'transaction_count' },
  { id: 'saving_master', title: 'Saving Master', description: 'Save a total of $10,000 in balance', threshold: 10000, type: 'balance' },
  { id: 'consistency_key', title: 'Consistency is Key', description: 'Log 50 transactions', threshold: 50, type: 'transaction_count' },
  { id: 'budget_champion', title: 'Budget Champion', description: 'Keep all budgets green', threshold: 0, type: 'budget_adherence' },
];

export const EXCHANGE_RATES = {
  'USD': { symbol: '$', rate: 1 },
  'EUR': { symbol: '€', rate: 0.92 },
  'INR': { symbol: '₹', rate: 83.5 }
};

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      budgets: mockBudgets,
      goals: [],
      notifications: [],
      achievements: [],
      role: 'Admin', // 'Admin' | 'Viewer'
      theme: 'light', // 'light' | 'dark'
      currency: 'USD',
      searchQuery: '',
      filters: {
        type: 'all',
        category: 'all',
        dateRange: { start: null, end: null },
        amountRange: { min: null, max: null },
        tags: [],
      },
      savedFilters: [],
      dashboardLayout: ['summary', 'cashflow', 'balanceTrend', 'spendingByCategory', 'budgetProgress', 'recentTransactions'],

      setDashboardLayout: (layout) => set({ dashboardLayout: layout }),

      setCurrency: (currency) => set({ currency }),

      checkAchievements: () => {
        const state = get();
        const balance = state.transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
        const transactionCount = state.transactions.length;

        ACHIEVEMENTS_LIST.forEach(achievement => {
          if (!state.achievements.find(a => a.id === achievement.id)) {
            let unlocked = false;
            
            if (achievement.type === 'transaction_count' && transactionCount >= achievement.threshold) unlocked = true;
            if (achievement.type === 'balance' && balance >= achievement.threshold) unlocked = true;

            if (unlocked) {
              const newAchievement = { ...achievement, unlockedAt: new Date().toISOString() };
              set(s => ({
                achievements: [...s.achievements, newAchievement],
                notifications: [
                  { id: crypto.randomUUID(), type: 'success', message: `Achievement Unlocked: ${achievement.title} 🏆!`, read: false, date: new Date().toISOString() },
                  ...s.notifications
                ]
              }));
            }
          }
        });
      },

      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [{ ...transaction, id: crypto.randomUUID() }, ...state.transactions],
        }));
        get().checkAchievements();
      },

      editTransaction: (updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
          ),
        }));
        get().checkAchievements();
      },

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      bulkDeleteTransactions: (ids) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => !ids.includes(t.id)),
        })),

      setBudget: (category, limit) =>
        set((state) => {
          const existing = state.budgets.find(b => b.category === category);
          if (existing) {
            return { budgets: state.budgets.map(b => b.category === category ? { ...b, limit } : b) };
          }
          return { budgets: [...state.budgets, { category, limit }] };
        }),

      addGoal: (goal) => 
        set((state) => ({
          goals: [...state.goals, { ...goal, id: crypto.randomUUID(), current: 0 }]
        })),
        
      updateGoalProgress: (id, amount) =>
        set((state) => ({
          goals: state.goals.map(g => g.id === id ? { ...g, current: amount } : g)
        })),
        
      deleteGoal: (id) => 
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [{ ...notification, id: crypto.randomUUID(), read: false, date: new Date().toISOString() }, ...state.notifications],
        })),

      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      setRole: (role) => set({ role }),
      
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      saveCurrentFilters: (name) => 
        set((state) => ({
          savedFilters: [...state.savedFilters, { id: crypto.randomUUID(), name, filterState: state.filters }]
        })),
        
      applySavedFilter: (id) => 
        set((state) => {
          const target = state.savedFilters.find(f => f.id === id);
          if (target) return { filters: target.filterState };
          return state;
        }),

      deleteSavedFilter: (id) =>
        set((state) => ({
          savedFilters: state.savedFilters.filter((f) => f.id !== id),
        })),

      importData: (data) => {
        set({ transactions: data });
        get().checkAchievements();
      },

      simulateRecurringTransactions: () => {
        const { transactions } = get();
        const now = new Date();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        
        let newTransactions = [];
        transactions.forEach(t => {
          if (t.isRecurring) {
            const tDate = new Date(t.date);
            if (now.getTime() - tDate.getTime() > thirtyDaysInMs) {
              const isAlreadyGenerated = transactions.some(
                existing => existing.category === t.category && 
                existing.amount === t.amount && 
                new Date(existing.date).getMonth() === now.getMonth() &&
                existing.id !== t.id
              );
              
              if (!isAlreadyGenerated) {
                newTransactions.push({
                  ...t,
                  id: crypto.randomUUID(),
                  date: now.toISOString(),
                });
              }
            }
          }
        });

        if (newTransactions.length > 0) {
          set(state => ({
            transactions: [...newTransactions, ...state.transactions],
            notifications: [{
              id: crypto.randomUUID(),
              type: 'info',
              message: `Auto-generated ${newTransactions.length} recurring transactions.`,
              read: false,
              date: now.toISOString()
            }, ...state.notifications]
          }));
          get().checkAchievements();
        }
      }
    }),
    {
      name: 'finance-dashboard-v3-storage',
    }
  )
);
