
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Kasir from '@/components/Kasir';
import Transaksi from '@/components/Transaksi';
import Laporan from '@/components/Laporan';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'kasir':
        return <Kasir />;
      case 'transaksi':
        return <Transaksi />;
      case 'laporan':
        return <Laporan />;
      case 'produk':
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Manajemen Produk</h1>
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">Fitur manajemen produk akan segera tersedia</p>
            </div>
          </div>
        );
      case 'jurnal':
        return (
          <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Jurnal Umum</h1>
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">Fitur jurnal umum akan segera tersedia</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
