import React from 'react';
import { TrendingUp, TrendingDown, Receipt, Package, DollarSign, Users, Plus, AlertTriangle, ArrowUpCircle, ArrowDownCircle, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { transactions, products, purchases, expenses, getFinancialSummary } = useApp();
  const navigate = useNavigate();
  const summary = getFinancialSummary();

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      navigate('/');
    }
  };

  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayRevenue = todayTransactions
    .filter(t => t.type === 'Penjualan')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayPurchases = purchases.filter(p => p.date === today);
  const todayPurchaseAmount = todayPurchases.reduce((sum, p) => sum + p.amount, 0);

  const todayExpenses = expenses.filter(e => e.date === today);
  const todayExpenseAmount = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const lowStockProducts = products.filter(p => p.stock < p.minStock);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Get this month's data
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const thisMonthRevenue = thisMonthTransactions
    .filter(t => t.type === 'Penjualan')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'PEMASUKAN Hari Ini',
      value: `Rp ${todayRevenue.toLocaleString('id-ID')}`,
      change: `${todayTransactions.filter(t => t.type === 'Penjualan').length} transaksi`,
      icon: ArrowUpCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'PENGELUARAN Hari Ini',
      value: `Rp ${(todayPurchaseAmount + todayExpenseAmount).toLocaleString('id-ID')}`,
      change: `${todayPurchases.length + todayExpenses.length} transaksi`,
      icon: ArrowDownCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total Produk',
      value: products.length.toString(),
      change: lowStockProducts.length > 0 ? `${lowStockProducts.length} stok rendah` : 'Stok aman',
      icon: Package,
      color: lowStockProducts.length > 0 ? 'text-orange-600' : 'text-green-600',
      bgColor: lowStockProducts.length > 0 ? 'bg-orange-100' : 'bg-green-100',
    },
    {
      title: 'Laba Bersih',
      value: `Rp ${(summary.netIncome || 0).toLocaleString('id-ID')}`,
      change: summary.netIncome >= 0 ? 'Profit' : 'Loss',
      icon: DollarSign,
      color: summary.netIncome >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: summary.netIncome >= 0 ? 'bg-blue-100' : 'bg-red-100',
    },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Sistem Akuntansi Indonesia - {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {products.length === 0 && transactions.length === 0 && (
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-blue-900 mb-2">🎉 Selamat Datang di Sistem Akuntansi Indonesia!</h2>
              <p className="text-blue-700 mb-4">
                Mari mulai perjalanan bisnis Anda dengan mencatat transaksi pertama!
              </p>
              <div className="bg-white/70 p-4 rounded-lg mb-4">
                <p className="text-blue-800 text-sm font-medium mb-3">📋 <strong>Panduan Cepat Memulai:</strong></p>
                <ol className="text-blue-700 text-sm space-y-2 text-left max-w-lg mx-auto">
                  <li><strong>1. Tambah Produk:</strong> Pergi ke menu <strong>Produk</strong> → Tambah produk untuk dijual</li>
                  <li><strong>2. Mulai Penjualan:</strong> Buka menu <strong>Kasir</strong> → Buat transaksi penjualan pertama</li>
                  <li><strong>3. Catat Pembelian:</strong> Di menu <strong>Pembelian</strong> → Input stok barang yang dibeli</li>
                  <li><strong>4. Monitor Keuangan:</strong> Lihat laporan di menu <strong>Transaksi</strong> dan <strong>Laporan</strong></li>
                </ol>
              </div>
              <p className="text-blue-600 text-xs">
                💡 <strong>Tips:</strong> Program ini akan otomatis menghitung laba rugi, membuat jurnal akuntansi, dan melacak cash flow Anda!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Alerts */}
      {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900">⚠️ Peringatan Stok</h3>
                {outOfStockProducts.length > 0 && (
                  <p className="text-orange-700 text-sm">
                    🚨 {outOfStockProducts.length} produk habis stok: {outOfStockProducts.map(p => p.name).join(', ')}
                  </p>
                )}
                {lowStockProducts.length > 0 && (
                  <p className="text-orange-700 text-sm">
                    ⚠️ {lowStockProducts.length} produk stok rendah (di bawah minimum)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} ml-4 flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Transaksi Terbaru
              </div>
              <span className="text-sm font-normal text-gray-500">
                {transactions.length} total
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada transaksi</p>
                <p className="text-sm text-gray-400 mt-1">
                  Gunakan menu Kasir untuk memulai penjualan pertama
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{transaction.customer}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Penjualan' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {transaction.id} • {new Date(transaction.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'Lunas' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Ringkasan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* PEMASUKAN */}
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                  💰 PEMASUKAN
                </h4>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Penjualan</span>
                  <span className="text-green-600 font-bold">
                    Rp {(summary.totalRevenue || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* PENGELUARAN */}
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  💸 PENGELUARAN
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-medium">Pembelian Stok</span>
                    <span className="text-red-600 font-bold">
                      Rp {(summary.totalPurchases || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-medium">Beban Operasional</span>
                    <span className="text-red-600 font-bold">
                      Rp {(summary.totalExpenses || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* PROFIT */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium">📊 Laba Kotor</span>
                  <span className={`font-bold ${summary.grossProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    Rp {(summary.grossProfit || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <span className="text-purple-700 font-semibold">🎯 Laba Bersih</span>
                  <span className={`font-bold text-lg ${summary.netIncome >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    Rp {(summary.netIncome || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              
              {summary.netIncome > 0 && summary.totalRevenue > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium text-center">
                    📈 <strong>Margin Laba:</strong> {((summary.netIncome / summary.totalRevenue) * 100).toFixed(1)}% - {
                      (summary.netIncome / summary.totalRevenue) * 100 > 15 ? 'Sangat Baik!' : 
                      (summary.netIncome / summary.totalRevenue) * 100 > 10 ? 'Baik' : 'Perlu Perbaikan'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
