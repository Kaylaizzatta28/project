
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Minus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface AddJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JournalLine {
  account: string;
  amount: number;
}

const AddJournalModal: React.FC<AddJournalModalProps> = ({ isOpen, onClose }) => {
  const { addJournalEntry } = useApp();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [debitLines, setDebitLines] = useState<JournalLine[]>([{ account: '', amount: 0 }]);
  const [creditLines, setCreditLines] = useState<JournalLine[]>([{ account: '', amount: 0 }]);
  const { toast } = useToast();

  const commonAccounts = [
    'Kas',
    'Bank',
    'Piutang Usaha',
    'Persediaan',
    'Peralatan',
    'Akumulasi Penyusutan',
    'Hutang Usaha',
    'Hutang Bank',
    'Modal',
    'Pendapatan Penjualan',
    'Beban Operasional',
    'Beban Administrasi',
    'Beban Penjualan',
    'Beban Bunga',
    'Pendapatan Lain-lain',
    'Beban Lain-lain'
  ];

  const addDebitLine = () => {
    setDebitLines([...debitLines, { account: '', amount: 0 }]);
  };

  const addCreditLine = () => {
    setCreditLines([...creditLines, { account: '', amount: 0 }]);
  };

  const removeDebitLine = (index: number) => {
    setDebitLines(debitLines.filter((_, i) => i !== index));
  };

  const removeCreditLine = (index: number) => {
    setCreditLines(creditLines.filter((_, i) => i !== index));
  };

  const updateDebitLine = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...debitLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setDebitLines(newLines);
  };

  const updateCreditLine = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...creditLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setCreditLines(newLines);
  };

  const totalDebit = debitLines.reduce((sum, line) => sum + (line.amount || 0), 0);
  const totalCredit = creditLines.reduce((sum, line) => sum + (line.amount || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = () => {
    if (!description || !reference) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi deskripsi dan referensi jurnal",
        variant: "destructive"
      });
      return;
    }

    if (!isBalanced) {
      toast({
        title: "Jurnal Tidak Balance",
        description: "Total debit harus sama dengan total kredit",
        variant: "destructive"
      });
      return;
    }

    const validDebitLines = debitLines.filter(line => line.account && line.amount > 0);
    const validCreditLines = creditLines.filter(line => line.account && line.amount > 0);

    if (validDebitLines.length === 0 || validCreditLines.length === 0) {
      toast({
        title: "Jurnal Tidak Valid",
        description: "Minimal harus ada satu baris debit dan kredit yang valid",
        variant: "destructive"
      });
      return;
    }

    const journalEntry = {
      date,
      description,
      reference,
      type: 'Manual' as const,
      debit: validDebitLines,
      credit: validCreditLines
    };

    addJournalEntry(journalEntry);

    toast({
      title: "Jurnal Berhasil",
      description: "Entri jurnal manual berhasil ditambahkan",
      className: "bg-green-50 border-green-200"
    });

    // Reset form
    setDescription('');
    setReference('');
    setDebitLines([{ account: '', amount: 0 }]);
    setCreditLines([{ account: '', amount: 0 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tambah Jurnal Manual</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Referensi</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Contoh: JM001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi transaksi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debit Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-600">DEBIT</h3>
                <Button type="button" onClick={addDebitLine} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>

              {debitLines.map((line, index) => (
                <div key={index} className="p-3 border rounded-lg bg-green-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Debit {index + 1}</span>
                    {debitLines.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDebitLine(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      list="accounts"
                      value={line.account}
                      onChange={(e) => updateDebitLine(index, 'account', e.target.value)}
                      placeholder="Nama akun"
                    />
                    <Input
                      type="number"
                      value={line.amount}
                      onChange={(e) => updateDebitLine(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Jumlah"
                      min="0"
                    />
                  </div>
                </div>
              ))}

              <div className="p-3 bg-green-100 rounded-lg">
                <div className="text-center">
                  <span className="text-sm text-gray-600">Total Debit</span>
                  <p className="text-lg font-bold text-green-600">
                    Rp {totalDebit.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            {/* Credit Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-red-600">KREDIT</h3>
                <Button type="button" onClick={addCreditLine} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah
                </Button>
              </div>

              {creditLines.map((line, index) => (
                <div key={index} className="p-3 border rounded-lg bg-red-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Kredit {index + 1}</span>
                    {creditLines.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCreditLine(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      list="accounts"
                      value={line.account}
                      onChange={(e) => updateCreditLine(index, 'account', e.target.value)}
                      placeholder="Nama akun"
                    />
                    <Input
                      type="number"
                      value={line.amount}
                      onChange={(e) => updateCreditLine(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="Jumlah"
                      min="0"
                    />
                  </div>
                </div>
              ))}

              <div className="p-3 bg-red-100 rounded-lg">
                <div className="text-center">
                  <span className="text-sm text-gray-600">Total Kredit</span>
                  <p className="text-lg font-bold text-red-600">
                    Rp {totalCredit.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Check */}
          <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            <div className="text-center">
              <p className={`font-medium ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {isBalanced ? '✓ Jurnal Balance' : '⚠ Jurnal Tidak Balance'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Selisih: Rp {Math.abs(totalDebit - totalCredit).toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!isBalanced}
            >
              Simpan Jurnal
            </Button>
          </div>

          {/* Account suggestions datalist */}
          <datalist id="accounts">
            {commonAccounts.map((account) => (
              <option key={account} value={account} />
            ))}
          </datalist>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddJournalModal;
