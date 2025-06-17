
import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Calculator, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Kasir: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const products = [
    { id: 'P001', name: 'Nasi Goreng', price: 15000, category: 'Makanan' },
    { id: 'P002', name: 'Mie Ayam', price: 12000, category: 'Makanan' },
    { id: 'P003', name: 'Es Teh', price: 5000, category: 'Minuman' },
    { id: 'P004', name: 'Kopi', price: 8000, category: 'Minuman' },
    { id: 'P005', name: 'Ayam Goreng', price: 18000, category: 'Makanan' },
    { id: 'P006', name: 'Jus Jeruk', price: 10000, category: 'Minuman' },
    { id: 'P007', name: 'Soto Ayam', price: 14000, category: 'Makanan' },
    { id: 'P008', name: 'Es Campur', price: 12000, category: 'Minuman' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const processTransaction = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }
    
    const transactionId = 'TRX' + Date.now().toString().slice(-6);
    alert(`Transaksi berhasil!\nNo. Transaksi: ${transactionId}\nTotal: Rp ${total.toLocaleString('id-ID')}`);
    
    // Reset form
    setCart([]);
    setCustomerName('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Products */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4">
            <Calculator className="mr-3 h-8 w-8" />
            Point of Sale
          </h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full max-w-md"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)] overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-fit"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                  <div className="text-lg font-bold text-green-600 mb-3">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Keranjang
          </h2>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Customer Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Pelanggan
            </label>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama pelanggan"
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-bold text-green-600">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total and Checkout */}
          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                onClick={processTransaction}
              >
                Proses Transaksi
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kasir;
