
import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Produk from '@/components/Produk';
import Kasir from '@/components/Kasir';
import Transaksi from '@/components/Transaksi';
import Jurnal from '@/components/Jurnal';
import Laporan from '@/components/Laporan';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'produk':
        return <Produk />;
      case 'kasir':
        return <Kasir />;
      case 'transaksi':
        return <Transaksi />;
      case 'jurnal':
        return <Jurnal />;
      case 'laporan':
        return <Laporan />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
