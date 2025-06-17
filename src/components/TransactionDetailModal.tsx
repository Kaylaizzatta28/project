
import React from 'react';
import { X, Calendar, User, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/contexts/AppContext';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Detail Transaksi</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Transaction Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">ID Transaksi</p>
                <p className="font-bold text-blue-600">{transaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'Lunas' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tanggal</p>
                <p className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(transaction.date).toLocaleDateString('id-ID')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tipe</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.type === 'Penjualan' ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100'
                }`}>
                  {transaction.type}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Informasi Pelanggan/Supplier
            </h3>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium">{transaction.customer}</p>
              <p className="text-sm text-gray-600">{transaction.description}</p>
            </div>
          </div>

          {/* Items */}
          {transaction.items && transaction.items.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Receipt className="h-4 w-4 mr-2" />
                Item Transaksi
              </h3>
              <div className="space-y-2">
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <p className="font-bold">
                      Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Transaksi:</span>
              <span className="text-green-600">
                Rp {transaction.amount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
