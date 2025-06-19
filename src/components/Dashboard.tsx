
import React from 'react';
import { TrendingUp, TrendingDown, Receipt, Package, DollarSign, Users, Plus, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Dashboard: React.FC = () => {
  const { transactions, products, getFinancialSummary } = useApp();
  const summary = getFinancialSummary();

  // Get today's transactions
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayRevenue = todayTransactions
    .filter(t => t.type === 'Penjualan')
    .reduce((sum, t) => sum + t.amount, 0);

  const lowStockProducts = products.filter(p => p.stock < 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Get this month's data
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const thisMonthRevenue = thisMonthTransactions
    .filter(t => t.type === 'Penjualan')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'Penjualan Hari Ini',
      value: `Rp ${todayRevenue.toLocaleString('id-ID')}`,
      change: todayTransactions.filter(t => t.type === 'Penjualan').length + ' transaksi',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Penjualan Bulan Ini',
      value: `Rp ${thisMonthRevenue.toLocaleString('id-ID')}`,
      change: thisMonthTransactions.filter(t => t.type === 'Penjualan').length + ' transaksi',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
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
      title: 'Laba Kotor',
      value: `Rp ${summary.grossProfit.toLocaleString('id-ID')}`,
      change: summary.grossProfit > 0 ? 'Profit' : summary.grossProfit < 0 ? 'Loss' : 'Break Even',
      icon: TrendingUp,
      color: summary.grossProfit >= 0 ? 'text-purple-600' : 'text-red-600',
      bgColor: summary.grossProfit >= 0 ? 'bg-purple-100' : 'bg-red-100',
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
              Selamat datang di Sistem Akuntansi Indonesia - {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      {products.length === 0 && transactions.length === 0 && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-blue-900 mb-2">Mulai Menggunakan Sistem</h2>
              <p className="text-blue-700 mb-4">
                Anda belum memiliki data. Mari mulai dengan menambahkan produk pertama untuk memulai bisnis Anda!
              </p>
              <p className="text-blue-600 text-sm mb-4">
                Langkah selanjutnya: Produk → Tambah Produk → Kasir → Mulai Penjualan
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts for important issues */}
      {(outOfStockProducts.length > 0 || lowStockProducts.length > 0) && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900">Peringatan Stok</h3>
                {outOfStockProducts.length > 0 && (
                  <p className="text-orange-700 text-sm">
                    {outOfStockProducts.length} produk habis stok: {outOfStockProducts.map(p => p.name).join(', ')}
                  </p>
                )}
                {lowStockProducts.length > 0 && (
                  <p className="text-orange-700 text-sm">
                    {lowStockProducts.length} produk stok rendah (kurang dari 10)
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
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} ml-4`}>
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
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Total Penjualan</span>
                <span className="text-green-600 font-bold">
                  Rp {summary.totalSales.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-700 font-medium">Beban Pokok Penjualan</span>
                <span className="text-orange-600 font-bold">
                  Rp {summary.totalCOGS.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700 font-medium">Laba Kotor</span>
                <span className={`font-bold ${summary.grossProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Rp {summary.grossProfit.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-700 font-medium">Laba Bersih</span>
                <span className={`font-bold ${summary.netIncome >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  Rp {summary.netIncome.toLocaleString('id-ID')}
                </span>
              </div>
              
              {summary.netIncome > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    💡 Margin Laba: {((summary.netIncome / Math.max(summary.totalSales, 1)) * 100).toFixed(1)}%
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
