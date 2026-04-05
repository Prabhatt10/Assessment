import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Transactions } from './pages/Transactions/Transactions';
import { Budgets } from './pages/Budgets/Budgets';
import { Insights } from './pages/Insights/Insights';
import { Goals } from './pages/Goals/Goals';
import { Settings } from './pages/Settings/Settings';
import { useFinanceStore } from './store/useFinanceStore';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Dashboard />
            </motion.div>
          } />
          <Route path="transactions" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Transactions />
            </motion.div>
          } />
          <Route path="budgets" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Budgets />
            </motion.div>
          } />
          <Route path="insights" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Insights />
            </motion.div>
          } />
          <Route path="goals" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Goals />
            </motion.div>
          } />
          <Route path="settings" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Settings />
            </motion.div>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { simulateRecurringTransactions } = useFinanceStore();

  useEffect(() => {
    simulateRecurringTransactions();
  }, [simulateRecurringTransactions]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
