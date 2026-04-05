import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions, mockBudgets } from '../data/mockData';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      budgets: mockBudgets,
      notifications: [],
      role: 'Admin', // 'Admin' | 'Viewer'
      theme: 'light', // 'light' | 'dark'
      searchQuery: '',
      filters: {
        type: 'all',
        category: 'all',
        dateRange: { start: null, end: null },
        amountRange: { min: null, max: null },
        tags: [],
      },

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [{ ...transaction, id: crypto.randomUUID() }, ...state.transactions],
        })),

      editTransaction: (updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
          ),
        })),

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

      importData: (data) => set({ transactions: data }),

      simulateRecurringTransactions: () => {
        const { transactions } = get();
        const now = new Date();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        
        let newTransactions = [];
        transactions.forEach(t => {
          if (t.isRecurring) {
            const tDate = new Date(t.date);
            if (now.getTime() - tDate.getTime() > thirtyDaysInMs) {
              // Create a duplicated transaction for the current month roughly
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
        }
      }
    }),
    {
      name: 'finance-dashboard-v2-storage',
    }
  )
);
