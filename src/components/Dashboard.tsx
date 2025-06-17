
import React from 'react';
import { TrendingUp, TrendingDown, Receipt, Package, DollarSign, Users, Plus } from 'lucide-react';
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

  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const stats = [
    {
      title: 'Total Penjualan Hari Ini',
      value: `Rp ${todayRevenue.toLocaleString('id-ID')}`,
      change: todayRevenue > 0 ? '+' + ((todayRevenue / Math.max(summary.totalRevenue - todayRevenue, 1)) * 100).toFixed(1) + '%' : '0%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Transaksi',
      value: summary.totalTransactions.toString(),
      change: summary.totalTransactions > 0 ? 'Aktif' : 'Belum Ada',
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Produk Stok Rendah',
      value: lowStockProducts.toString(),
      change: lowStockProducts > 0 ? 'Perlu Restok' : 'Aman',
      icon: Package,
      color: lowStockProducts > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: lowStockProducts > 0 ? 'bg-red-100' : 'bg-green-100',
    },
    {
      title: 'Laba Bersih',
      value: `Rp ${summary.netIncome.toLocaleString('id-ID')}`,
      change: summary.netIncome > 0 ? 'Profit' : summary.netIncome < 0 ? 'Loss' : 'Break Even',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Selamat datang di Sistem Akuntansi Indonesia</p>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      {products.length === 0 && transactions.length === 0 && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Mulai Menggunakan Sistem</h2>
              <p className="text-blue-700 mb-4">Anda belum memiliki data. Mari mulai dengan menambahkan produk pertama!</p>
              <div className="flex justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk Pertama
                </Button>
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
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
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
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              Transaksi Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada transaksi</p>
                <p className="text-sm text-gray-400 mt-1">Transaksi akan muncul setelah penjualan di kasir</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.customer}</p>
                      <p className="text-sm text-gray-600">{transaction.id} • {new Date(transaction.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Rp {transaction.amount.toLocaleString('id-ID')}</p>
                      <p className={`text-sm ${transaction.type === 'Penjualan' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type}
                      </p>
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
                <span className="text-green-700 font-medium">Total Pendapatan</span>
                <span className="text-green-600 font-bold">Rp {summary.totalRevenue.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-700 font-medium">Total Pengeluaran</span>
                <span className="text-red-600 font-bold">Rp {summary.totalExpenses.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700 font-medium">Laba Bersih</span>
                <span className={`font-bold ${summary.netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Rp {summary.netIncome.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
