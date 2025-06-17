
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  type: 'Penjualan' | 'Pembelian';
  amount: number;
  description: string;
  status: 'Lunas' | 'Belum Lunas';
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debit: { account: string; amount: number }[];
  credit: { account: string; amount: number }[];
}

interface AppContextType {
  products: Product[];
  transactions: Transaction[];
  journalEntries: JournalEntry[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateProductStock: (productId: string, quantity: number) => void;
  getFinancialSummary: () => {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    totalTransactions: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: 'P001', name: 'Nasi Goreng', price: 15000, category: 'Makanan', stock: 50 },
    { id: 'P002', name: 'Mie Ayam', price: 12000, category: 'Makanan', stock: 30 },
    { id: 'P003', name: 'Es Teh', price: 5000, category: 'Minuman', stock: 100 },
    { id: 'P004', name: 'Kopi', price: 8000, category: 'Minuman', stock: 80 },
    { id: 'P005', name: 'Ayam Goreng', price: 18000, category: 'Makanan', stock: 25 },
    { id: 'P006', name: 'Jus Jeruk', price: 10000, category: 'Minuman', stock: 60 },
    { id: 'P007', name: 'Soto Ayam', price: 14000, category: 'Makanan', stock: 35 },
    { id: 'P008', name: 'Es Campur', price: 12000, category: 'Minuman', stock: 40 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TRX001',
      date: new Date().toISOString().split('T')[0],
      customer: 'Ahmad Wijaya',
      type: 'Penjualan',
      amount: 125000,
      description: 'Penjualan nasi goreng dan es teh',
      status: 'Lunas'
    },
    {
      id: 'TRX002',
      date: new Date().toISOString().split('T')[0],
      customer: 'Siti Nurhaliza',
      type: 'Penjualan',
      amount: 89500,
      description: 'Penjualan mie ayam dan jus jeruk',
      status: 'Lunas'
    }
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'JE001',
      date: new Date().toISOString().split('T')[0],
      description: 'Penjualan tunai',
      debit: [{ account: 'Kas', amount: 125000 }],
      credit: [{ account: 'Pendapatan Penjualan', amount: 125000 }]
    }
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: 'TRX' + Date.now().toString().slice(-6)
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Auto create journal entry for sales
    if (transaction.type === 'Penjualan') {
      addJournalEntry({
        date: transaction.date,
        description: `Penjualan - ${transaction.customer}`,
        debit: [{ account: 'Kas', amount: transaction.amount }],
        credit: [{ account: 'Pendapatan Penjualan', amount: transaction.amount }]
      });
    }
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: 'JE' + Date.now().toString().slice(-6)
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const updateProductStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, stock: Math.max(0, product.stock - quantity) }
        : product
    ));
  };

  const getFinancialSummary = () => {
    const revenue = transactions
      .filter(t => t.type === 'Penjualan')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'Pembelian')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netIncome: revenue - expenses,
      totalTransactions: transactions.length
    };
  };

  return (
    <AppContext.Provider value={{
      products,
      transactions,
      journalEntries,
      addTransaction,
      addJournalEntry,
      updateProductStock,
      getFinancialSummary
    }}>
      {children}
    </AppContext.Provider>
  );
};
