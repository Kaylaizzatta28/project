import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number; // Harga pokok
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
    cost?: number; // For purchase transactions
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
    totalSales: number; // Alias for compatibility
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

// Sample data with more realistic accounting structure
const initialProducts: Product[] = [
  // Sample data for products
  {
    id: '4',
    name: 'Kopi Susu',
    category: 'Minuman',
    price: 12000,
    cost: 5000,
    stock: 80,
    minStock: 15,
    supplier: 'Supplier Kopi Mantap'
  },
  {
    id: '5',
    name: 'Rendang Daging Sapi',
    category: 'Makanan',
    price: 45000,
    cost: 30000,
    stock: 25,
    minStock: 5,
    supplier: 'Supplier Rendang Padang'
  },
  {
    id: '6',
    name: 'Jus Alpukat',
    category: 'Minuman',
    price: 15000,
    cost: 7000,
    stock: 60,
    minStock: 12,
    supplier: 'Supplier Alpukat Segar'
  },
  {
    id: '1',
    name: 'Nasi Gudeg',
    category: 'Makanan',
    price: 25000,
    cost: 15000,
    stock: 50,
    minStock: 10,
    supplier: 'Supplier Gudeg Jogja'
  },
  {
    id: '2',
    name: 'Es Teh Manis',
    category: 'Minuman',
    price: 8000,
    cost: 3000,
    stock: 100,
    minStock: 20,
    supplier: 'Supplier Minuman'
  },
  {
    id: '3',
    name: 'Ayam Goreng',
    category: 'Makanan',
    price: 30000,
    cost: 20000,
    stock: 30,
    minStock: 5,
    supplier: 'Supplier Ayam'
  }
];

const initialTransactions: Transaction[] = [
  {
    id: 'TRX001',
    date: '2024-01-15',
    customer: 'Ahmad Wijaya',
    type: 'Penjualan',
    amount: 58000,
    description: 'Nasi Gudeg (2), Es Teh Manis (1)',
    status: 'Lunas',
    items: [
      { productId: '1', productName: 'Nasi Gudeg', quantity: 2, price: 25000 },
      { productId: '2', productName: 'Es Teh Manis', quantity: 1, price: 8000 }
    ],
    paymentMethod: 'Tunai',
    cashReceived: 60000,
    change: 2000
  }
];

const initialPurchases: Purchase[] = [
  {
    id: 'PUR001',
    date: '2024-01-10',
    supplier: 'Supplier Gudeg Jogja',
    amount: 750000,
    description: 'Pembelian bahan baku gudeg',
    status: 'Lunas',
    items: [
      { productId: '1', productName: 'Bahan Gudeg', quantity: 50, cost: 15000 }
    ],
    paymentMethod: 'Transfer'
  }
];

const initialExpenses: Expense[] = [
  {
    id: 'EXP001',
    date: '2024-01-15',
    description: 'Bayar listrik bulanan',
    amount: 500000,
    category: 'Operasional',
    status: 'Lunas'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
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
              ? product.stock - quantity 
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
    setTransactions([...transactions, newTransaction]);
    
    // Auto-generate journal entry for sales
    if (transaction.type === 'Penjualan') {
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
    setPurchases([...purchases, newPurchase]);
    
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
    setJournalEntries([...journalEntries, newEntry]);
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { 
      ...expense, 
      id: 'EXP' + Date.now().toString().slice(-6) 
    };
    setExpenses([...expenses, newExpense]);
    
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
    const totalRevenue = transactions
      .filter(t => t.type === 'Penjualan' && t.status === 'Lunas')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalPurchases = purchases
      .filter(p => p.status === 'Lunas')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalExpenses = expenses
      .filter(e => e.status === 'Lunas')
      .reduce((sum, e) => sum + e.amount, 0);
    
    // Calculate COGS (Cost of Goods Sold) from sales transactions
    const totalCOGS = transactions
      .filter(t => t.type === 'Penjualan' && t.status === 'Lunas')
      .reduce((sum, t) => {
        return sum + t.items.reduce((itemSum, item) => {
          const product = products.find(p => p.id === item.productId);
          return itemSum + (item.quantity * (product?.cost || 0));
        }, 0);
      }, 0);
    
    const grossProfit = totalRevenue - totalCOGS;
    const netIncome = grossProfit - totalExpenses;
    
    // Calculate assets, liabilities, and equity
    const currentAssets = totalRevenue * 0.6; // Cash and receivables
    const inventory = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    const fixedAssets = totalRevenue * 0.8; // Equipment and property
    const totalAssets = currentAssets + inventory + fixedAssets;
    
    const totalLiabilities = totalPurchases * 0.3; // Accounts payable and loans
    const equity = totalAssets - totalLiabilities;

    return {
      totalRevenue,
      totalSales: totalRevenue, // Alias for compatibility
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
    
    return {
      kas: summary.totalRevenue - summary.totalExpenses - summary.totalPurchases,
      piutang: summary.totalRevenue * 0.1, // 10% of revenue as receivables
      persediaan: products.reduce((sum, p) => sum + (p.stock * p.cost), 0),
      peralatan: summary.totalRevenue * 0.8,
      hutangUsaha: summary.totalPurchases * 0.2,
      hutangBank: summary.totalPurchases * 0.1,
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
