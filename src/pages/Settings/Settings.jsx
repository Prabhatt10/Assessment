import React, { useState } from 'react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Papa from 'papaparse';
import { Upload, Download, Copy, AlertTriangle } from 'lucide-react';

export const Settings = () => {
  const { transactions, importData, role } = useFinanceStore();
  const [jsonText, setJsonText] = useState('');

  const exportCSV = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions_export.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleJsonImport = () => {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data)) {
        if(confirm(`Are you sure you want to overwrite all transactions with ${data.length} imported items?`)) {
          importData(data);
          setJsonText('');
          alert('Import successful!');
        }
      } else {
        alert('JSON must be an array of transactions.');
      }
    } catch(e) {
      alert('Invalid JSON format.');
    }
  };

  if (role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertTriangle className="h-12 w-12 mb-4 text-amber-500 opacity-50" />
        <h2 className="text-xl font-bold dark:text-gray-300">Access Denied</h2>
        <p className="mt-2 text-sm">Only Admins can access Settings and perform exports/imports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage data import and export.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Download your secure transaction ledger.</p>
            <div className="flex gap-4">
              <Button onClick={exportCSV} className="gap-2" variant="outline">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button onClick={exportJSON} className="gap-2" variant="outline">
                <Copy className="h-4 w-4" /> Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import JSON Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Restore your state from a JSON backup. WARNING: This will immediately overwrite the current transaction database.</p>
            <textarea 
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste JSON array here..."
              className="w-full h-32 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:text-white"
            />
            <Button onClick={handleJsonImport} className="gap-2 w-full" disabled={!jsonText.trim()}>
              <Upload className="h-4 w-4" /> Import Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
