
import React, { useState } from 'react';
import { TrendingUp, Plus, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import AddJournalModal from './AddJournalModal';

const Jurnal: React.FC = () => {
  const { journalEntries } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('bulan-ini');
  const [showAddModal, setShowAddModal] = useState(false);

  const totalDebit = journalEntries.reduce((sum, entry) => 
    sum + entry.debit.reduce((debitSum, item) => debitSum + item.amount, 0), 0);
  
  const totalCredit = journalEntries.reduce((sum, entry) => 
    sum + entry.credit.reduce((creditSum, item) => creditSum + item.amount, 0), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="mr-3 h-8 w-8" />
              Jurnal Umum
            </h1>
            <p className="text-gray-600 mt-2">Pencatatan jurnal akuntansi berdasarkan transaksi</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                <SelectItem value="bulan-lalu">Bulan Lalu</SelectItem>
                <SelectItem value="triwulan">Triwulan</SelectItem>
                <SelectItem value="tahun-ini">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Jurnal
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Entri Jurnal</p>
              <p className="text-2xl font-bold text-blue-600">{journalEntries.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Debit</p>
              <p className="text-2xl font-bold text-green-600">Rp {totalDebit.toLocaleString('id-ID')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Kredit</p>
              <p className="text-2xl font-bold text-red-600">Rp {totalCredit.toLocaleString('id-ID')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journal Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Entri Jurnal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {journalEntries.map((entry, index) => (
              <div key={entry.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{entry.description}</h3>
                    <p className="text-sm text-gray-600">
                      {entry.id} • {new Date(entry.date).toLocaleDateString('id-ID')} • {entry.type}
                      {entry.reference && ` • Ref: ${entry.reference}`}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Debit */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">DEBIT</h4>
                    <div className="space-y-2">
                      {entry.debit.map((debitItem, debitIndex) => (
                        <div key={debitIndex} className="flex justify-between bg-green-50 p-2 rounded">
                          <span className="text-gray-700">{debitItem.account}</span>
                          <span className="font-medium text-green-600">
                            Rp {debitItem.amount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Credit */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">KREDIT</h4>
                    <div className="space-y-2">
                      {entry.credit.map((creditItem, creditIndex) => (
                        <div key={creditIndex} className="flex justify-between bg-red-50 p-2 rounded">
                          <span className="text-gray-700">{creditItem.account}</span>
                          <span className="font-medium text-red-600">
                            Rp {creditItem.amount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Debit: Rp {entry.debit.reduce((sum, item) => sum + item.amount, 0).toLocaleString('id-ID')}</span>
                    <span>Total Kredit: Rp {entry.credit.reduce((sum, item) => sum + item.amount, 0).toLocaleString('id-ID')}</span>
                  </div>
                  {entry.debit.reduce((sum, item) => sum + item.amount, 0) === 
                   entry.credit.reduce((sum, item) => sum + item.amount, 0) ? (
                    <p className="text-center text-green-600 text-sm mt-2">✓ Jurnal Balance</p>
                  ) : (
                    <p className="text-center text-red-600 text-sm mt-2">⚠ Jurnal Tidak Balance</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {journalEntries.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada entri jurnal</p>
              <p className="text-sm text-gray-400 mt-2">Jurnal akan otomatis dibuat saat ada transaksi atau Anda dapat menambah jurnal manual</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Jurnal Manual
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddJournalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Jurnal;
