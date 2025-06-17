
import React from 'react';
import { TrendingUp, TrendingDown, Receipt, Package, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Transaksi',
      value: summary.totalTransactions.toString(),
      change: '+8.2%',
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
      change: '+15.3%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di Sistem Akuntansi Indonesia</p>
      </div>

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
          </CardContent>
        </Card>

        {/* Sales Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Grafik Penjualan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Total Penjualan: Rp {summary.totalRevenue.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-500 mt-2">Laba Bersih: Rp {summary.netIncome.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
