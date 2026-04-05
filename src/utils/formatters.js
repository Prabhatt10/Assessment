import { useFinanceStore, EXCHANGE_RATES } from '../store/useFinanceStore';
import { format as formatDFNS } from 'date-fns';

export const formatCurrency = (amount) => {
  const { currency } = useFinanceStore.getState();
  const rateData = EXCHANGE_RATES[currency] || EXCHANGE_RATES['USD'];
  const converted = amount * rateData.rate;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
};

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  return formatDFNS(new Date(dateString), formatStr);
};
