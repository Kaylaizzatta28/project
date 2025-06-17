
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
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
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
  // Start with empty data - user builds from scratch
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: 'P' + Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productUpdate } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

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
    } else if (transaction.type === 'Pembelian') {
      addJournalEntry({
        date: transaction.date,
        description: `Pembelian - ${transaction.customer}`,
        debit: [{ account: 'Persediaan', amount: transaction.amount }],
        credit: [{ account: 'Kas', amount: transaction.amount }]
      });
    }
  };

  const updateTransaction = (id: string, transactionUpdate: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...transactionUpdate } : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
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
      addProduct,
      updateProduct,
      deleteProduct,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addJournalEntry,
      updateProductStock,
      getFinancialSummary
    }}>
      {children}
    </AppContext.Provider>
  );
};
