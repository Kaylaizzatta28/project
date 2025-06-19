
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  type: 'Penjualan' | 'Pembelian';
  amount: number;
  description: string;
  status: 'Lunas' | 'Belum Lunas' | 'Hutang' | 'Piutang';
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debit: { account: string; amount: number }[];
  credit: { account: string; amount: number }[];
  transactionId?: string;
  createdAt: string;
}

interface AppContextType {
  products: Product[];
  transactions: Transaction[];
  journalEntries: JournalEntry[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateProductStock: (productId: string, quantity: number) => void;
  getFinancialSummary: () => {
    totalRevenue: number;
    totalExpenses: number;
    totalCOGS: number;
    grossProfit: number;
    netIncome: number;
    totalTransactions: number;
    totalSales: number;
    totalPurchases: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: 'P' + Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...productUpdate, updatedAt: new Date().toISOString() } 
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...transaction,
      id: 'TRX' + Date.now().toString().slice(-6),
      createdAt: now
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Create proper journal entries based on Indonesian accounting standards
    if (transaction.type === 'Penjualan') {
      // For sales: Debit Cash/Accounts Receivable, Credit Sales Revenue
      const salesJournal: Omit<JournalEntry, 'id' | 'createdAt'> = {
        date: transaction.date,
        description: `Penjualan kepada ${transaction.customer}`,
        debit: [{ 
          account: transaction.status === 'Lunas' ? 'Kas' : 'Piutang Dagang', 
          amount: transaction.amount 
        }],
        credit: [{ 
          account: 'Pendapatan Penjualan', 
          amount: transaction.amount 
        }],
        transactionId: newTransaction.id
      };
      addJournalEntry(salesJournal);

      // If there are items, also record COGS (Cost of Goods Sold)
      if (transaction.items && transaction.items.length > 0) {
        let totalCOGS = 0;
        transaction.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            // Simplified COGS calculation (could be improved with proper inventory costing)
            const cogs = product.price * 0.6 * item.quantity; // Assuming 60% COGS
            totalCOGS += cogs;
          }
        });

        if (totalCOGS > 0) {
          const cogsJournal: Omit<JournalEntry, 'id' | 'createdAt'> = {
            date: transaction.date,
            description: `Beban Pokok Penjualan - ${transaction.customer}`,
            debit: [{ account: 'Beban Pokok Penjualan', amount: totalCOGS }],
            credit: [{ account: 'Persediaan Barang Dagang', amount: totalCOGS }],
            transactionId: newTransaction.id
          };
          addJournalEntry(cogsJournal);
        }
      }
    } else if (transaction.type === 'Pembelian') {
      // For purchases: Debit Inventory, Credit Cash/Accounts Payable
      const purchaseJournal: Omit<JournalEntry, 'id' | 'createdAt'> = {
        date: transaction.date,
        description: `Pembelian dari ${transaction.customer}`,
        debit: [{ 
          account: 'Persediaan Barang Dagang', 
          amount: transaction.amount 
        }],
        credit: [{ 
          account: transaction.status === 'Lunas' ? 'Kas' : 'Hutang Dagang', 
          amount: transaction.amount 
        }],
        transactionId: newTransaction.id
      };
      addJournalEntry(purchaseJournal);
    }
  };

  const updateTransaction = (id: string, transactionUpdate: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...transactionUpdate } : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    // Also delete related journal entries
    setJournalEntries(prev => prev.filter(entry => entry.transactionId !== id));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: 'JE' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const updateProductStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            stock: Math.max(0, product.stock - quantity),
            updatedAt: new Date().toISOString()
          }
        : product
    ));
  };

  const getFinancialSummary = () => {
    const salesTransactions = transactions.filter(t => t.type === 'Penjualan');
    const purchaseTransactions = transactions.filter(t => t.type === 'Pembelian');

    const totalSales = salesTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPurchases = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Calculate COGS from journal entries
    const cogsEntries = journalEntries.filter(entry => 
      entry.debit.some(d => d.account === 'Beban Pokok Penjualan')
    );
    const totalCOGS = cogsEntries.reduce((sum, entry) => 
      sum + entry.debit.find(d => d.account === 'Beban Pokok Penjualan')?.amount || 0, 0
    );

    const grossProfit = totalSales - totalCOGS;
    
    // Calculate operating expenses (simplified)
    const operatingExpenses = totalSales * 0.2; // Assuming 20% operating expenses
    const netIncome = grossProfit - operatingExpenses;

    return {
      totalRevenue: totalSales,
      totalExpenses: totalPurchases + operatingExpenses,
      totalCOGS,
      grossProfit,
      netIncome,
      totalTransactions: transactions.length,
      totalSales,
      totalPurchases
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
