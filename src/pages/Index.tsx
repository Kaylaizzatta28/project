
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Kasir from '@/components/Kasir';
import Transaksi from '@/components/Transaksi';
import Laporan from '@/components/Laporan';
import Produk from '@/components/Produk';
import Jurnal from '@/components/Jurnal';
import { AppProvider } from '@/contexts/AppContext';

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
        return <Produk />;
      case 'jurnal':
        return <Jurnal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </AppProvider>
  );
};

export default Index;
