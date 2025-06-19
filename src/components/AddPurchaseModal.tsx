
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus, Minus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PurchaseItem {
  productName: string;
  quantity: number;
  cost: number;
  category: string;
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ isOpen, onClose }) => {
  const { addPurchase, addProduct } = useApp();
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer' | 'Kredit'>('Tunai');
  const [status, setStatus] = useState<'Lunas' | 'Belum Lunas'>('Lunas');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, cost: 0, category: 'Umum' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  const handleSubmit = () => {
    if (!supplier || !description || items.length === 0) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi semua data pembelian",
        variant: "destructive"
      });
      return;
    }

    if (items.some(item => !item.productName || item.quantity <= 0 || item.cost <= 0)) {
      toast({
        title: "Item Tidak Valid",
        description: "Pastikan semua item memiliki nama, jumlah, dan harga yang valid",
        variant: "destructive"
      });
      return;
    }

    // Create products if they don't exist and get their IDs
    const purchaseItems = items.map(item => {
      // Auto-create product if it doesn't exist
      const productId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Add to products with selling price = cost * 1.3 (30% markup)
      const sellingPrice = Math.round(item.cost * 1.3);
      
      addProduct({
        name: item.productName,
        category: item.category,
        price: sellingPrice,
        cost: item.cost,
        stock: item.quantity,
        minStock: 5,
        supplier: supplier
      });

      return {
        productId: productId,
        productName: item.productName,
        quantity: item.quantity,
        cost: item.cost
      };
    });

    const purchase = {
      date,
      supplier,
      amount: totalAmount,
      description,
      status,
      items: purchaseItems,
      paymentMethod
    };

    addPurchase(purchase);

    toast({
      title: "✅ Pembelian Berhasil",
      description: `Pembelian dari ${supplier} berhasil dicatat. Produk baru otomatis ditambahkan ke inventori.`,
      className: "bg-green-50 border-green-200 text-green-800",
    });

    // Reset form
    setSupplier('');
    setDescription('');
    setItems([]);
    setStatus('Lunas');
    setPaymentMethod('Tunai');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tambah Pembelian Baru</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Nama supplier"
              />
            </div>
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
              <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="Transfer">Transfer Bank</SelectItem>
                  <SelectItem value="Kredit">Kredit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status Pembayaran</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi pembelian"
            />
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Item Pembelian</Label>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Produk</Label>
                    <Input
                      value={item.productName}
                      onChange={(e) => updateItem(index, 'productName', e.target.value)}
                      placeholder="Nama produk"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select 
                      value={item.category} 
                      onValueChange={(value) => updateItem(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Umum">Umum</SelectItem>
                        <SelectItem value="Makanan">Makanan</SelectItem>
                        <SelectItem value="Minuman">Minuman</SelectItem>
                        <SelectItem value="Elektronik">Elektronik</SelectItem>
                        <SelectItem value="Pakaian">Pakaian</SelectItem>
                        <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                        <SelectItem value="Rumah Tangga">Rumah Tangga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Jumlah</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Harga Beli (per unit)</Label>
                    <Input
                      type="number"
                      value={item.cost}
                      onChange={(e) => updateItem(index, 'cost', parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtotal</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      Rp {(item.quantity * item.cost).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Informasi Otomatis */}
          {items.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informasi:</h4>
              <p className="text-sm text-blue-700 mb-2">
                • Produk akan otomatis ditambahkan ke inventori jika belum ada
              </p>
              <p className="text-sm text-blue-700">
                • Harga jual akan diset otomatis dengan markup 30% dari harga beli
              </p>
            </div>
          )}

          {/* Total */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Pembelian:</span>
              <span className="text-green-600">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Simpan Pembelian
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPurchaseModal;
