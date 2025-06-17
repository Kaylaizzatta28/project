
import React, { useState } from 'react';
import { Plus, Search, Filter, Receipt, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';

const Transaksi: React.FC = () => {
  const { transactions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    return status === 'Lunas' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getTypeColor = (type: string) => {
    return type === 'Penjualan' ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Receipt className="mr-3 h-8 w-8" />
              Transaksi
            </h1>
            <p className="text-gray-600 mt-2">Kelola semua transaksi penjualan dan pembelian</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari transaksi berdasarkan nama pelanggan atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Transaksi</SelectItem>
                  <SelectItem value="penjualan">Penjualan</SelectItem>
                  <SelectItem value="pembelian">Pembelian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
              <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Penjualan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {transactions.filter(t => t.type === 'Penjualan').reduce((sum, t) => sum + t.amount, 0).toLocaleString('id-ID')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Pembelian</p>
              <p className="text-2xl font-bold text-red-600">
                Rp {transactions.filter(t => t.type === 'Pembelian').reduce((sum, t) => sum + t.amount, 0).toLocaleString('id-ID')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID Transaksi</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tanggal</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pelanggan/Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipe</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Jumlah</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-blue-600">{transaction.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.customer}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" title="Lihat Detail">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada transaksi yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transaksi;
