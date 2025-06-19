
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier?: string;
}

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  type: 'Penjualan' | 'Pembelian';
  amount: number;
  description: string;
  status: 'Lunas' | 'Belum Lunas';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    cost?: number;
  }[];
  paymentMethod?: 'Tunai' | 'Transfer' | 'Kredit';
  cashReceived?: number;
  change?: number;
}

export interface Purchase {
  id: string;
  date: string;
  supplier: string;
  amount: number;
  description: string;
  status: 'Lunas' | 'Belum Lunas';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    cost: number;
  }[];
  paymentMethod?: 'Tunai' | 'Transfer' | 'Kredit';
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: { account: string; amount: number }[];
  credit: { account: string; amount: number }[];
  type: 'Manual' | 'Automatic';
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'Operasional' | 'Administrasi' | 'Penjualan' | 'Lainnya';
  status: 'Lunas' | 'Belum Lunas';
}

interface AppContextType {
  products: Product[];
  transactions: Transaction[];
  purchases: Purchase[];
  journalEntries: JournalEntry[];
  expenses: Expense[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, quantity: number, type?: 'sale' | 'purchase') => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  deletePurchase: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  getFinancialSummary: () => {
    totalRevenue: number;
    totalSales: number;
    totalExpenses: number;
    totalPurchases: number;
    totalCOGS: number;
    grossProfit: number;
    netIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
  };
  getAccountsData: () => {
    kas: number;
    piutang: number;
    persediaan: number;
    peralatan: number;
    hutangUsaha: number;
    hutangBank: number;
    modal: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Start with clean data (fresh startup)
const initialProducts: Product[] = [];
const initialTransactions: Transaction[] = [];
const initialPurchases: Purchase[] = [];
const initialExpenses: Expense[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const updateProductStock = (id: string, quantity: number, type: 'sale' | 'purchase' = 'sale') => {
    setProducts(products.map(product => 
      product.id === id 
        ? { 
            ...product, 
            stock: type === 'sale' 
              ? Math.max(0, product.stock - quantity) 
              : product.stock + quantity 
          }
        : product
    ));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { 
      ...transaction, 
      id: 'TRX' + Date.now().toString().slice(-6) 
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update stock for sales
    if (transaction.type === 'Penjualan') {
      transaction.items.forEach(item => {
        updateProductStock(item.productId, item.quantity, 'sale');
      });
      
      // Auto-generate journal entry for sales
      const journalEntry: Omit<JournalEntry, 'id'> = {
        date: transaction.date,
        description: `Penjualan - ${transaction.description}`,
        reference: newTransaction.id,
        type: 'Automatic',
        debit: [
          { account: 'Kas', amount: transaction.amount }
        ],
        credit: [
          { account: 'Pendapatan Penjualan', amount: transaction.amount }
        ]
      };
      addJournalEntry(journalEntry);
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase = { 
      ...purchase, 
      id: 'PUR' + Date.now().toString().slice(-6) 
    };
    setPurchases([newPurchase, ...purchases]);
    
    // Auto-generate journal entry for purchases
    const journalEntry: Omit<JournalEntry, 'id'> = {
      date: purchase.date,
      description: `Pembelian - ${purchase.description}`,
      reference: newPurchase.id,
      type: 'Automatic',
      debit: [
        { account: 'Persediaan', amount: purchase.amount }
      ],
      credit: [
        { account: 'Kas', amount: purchase.amount }
      ]
    };
    addJournalEntry(journalEntry);
  };

  const deletePurchase = (id: string) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { 
      ...entry, 
      id: 'JRN' + Date.now().toString().slice(-6) 
    };
    setJournalEntries([newEntry, ...journalEntries]);
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { 
      ...expense, 
      id: 'EXP' + Date.now().toString().slice(-6) 
    };
    setExpenses([newExpense, ...expenses]);
    
    // Auto-generate journal entry for expenses
    const journalEntry: Omit<JournalEntry, 'id'> = {
      date: expense.date,
      description: `Beban ${expense.category} - ${expense.description}`,
      reference: newExpense.id,
      type: 'Automatic',
      debit: [
        { account: `Beban ${expense.category}`, amount: expense.amount }
      ],
      credit: [
        { account: 'Kas', amount: expense.amount }
      ]
    };
    addJournalEntry(journalEntry);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getFinancialSummary = () => {
    // REVENUE (Pemasukan)
    const totalRevenue = transactions
      .filter(t => t.type === 'Penjualan' && t.status === 'Lunas')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // EXPENSES (Pengeluaran)
    const totalPurchases = purchases
      .filter(p => p.status === 'Lunas')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalExpenses = expenses
      .filter(e => e.status === 'Lunas')
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Calculate COGS (Cost of Goods Sold)
    const totalCOGS = transactions
      .filter(t => t.type === 'Penjualan' && t.status === 'Lunas')
      .reduce((sum, t) => {
        return sum + t.items.reduce((itemSum, item) => {
          const product = products.find(p => p.id === item.productId);
          return itemSum + (item.quantity * (product?.cost || item.cost || 0));
        }, 0);
      }, 0);
    
    const grossProfit = totalRevenue - totalCOGS;
    const netIncome = grossProfit - totalExpenses;
    
    // Assets, Liabilities, and Equity calculation
    const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    const cash = totalRevenue - totalExpenses - totalPurchases;
    const totalAssets = Math.max(0, cash) + inventoryValue;
    const totalLiabilities = purchases.filter(p => p.status === 'Belum Lunas').reduce((sum, p) => sum + p.amount, 0);
    const equity = totalAssets - totalLiabilities;

    return {
      totalRevenue,
      totalSales: totalRevenue,
      totalExpenses,
      totalPurchases,
      totalCOGS,
      grossProfit,
      netIncome,
      totalAssets,
      totalLiabilities,
      equity
    };
  };

  const getAccountsData = () => {
    const summary = getFinancialSummary();
    const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    
    return {
      kas: Math.max(0, summary.totalRevenue - summary.totalExpenses - summary.totalPurchases),
      piutang: transactions.filter(t => t.status === 'Belum Lunas').reduce((sum, t) => sum + t.amount, 0),
      persediaan: inventoryValue,
      peralatan: summary.totalPurchases * 0.1, // 10% of purchases as equipment
      hutangUsaha: purchases.filter(p => p.status === 'Belum Lunas').reduce((sum, p) => sum + p.amount, 0),
      hutangBank: expenses.filter(e => e.status === 'Belum Lunas').reduce((sum, e) => sum + e.amount, 0),
      modal: summary.equity
    };
  };

  const value: AppContextType = {
    products,
    transactions,
    purchases,
    journalEntries,
    expenses,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    addTransaction,
    deleteTransaction,
    addPurchase,
    deletePurchase,
    addJournalEntry,
    deleteJournalEntry,
    addExpense,
    deleteExpense,
    getFinancialSummary,
    getAccountsData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
