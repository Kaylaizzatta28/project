
import React from 'react';
import { LayoutDashboard, Package, Calculator, Receipt, TrendingUp, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produk', label: 'Produk', icon: Package },
    { id: 'kasir', label: 'Kasir', icon: Calculator },
    { id: 'transaksi', label: 'Transaksi', icon: Receipt },
    { id: 'jurnal', label: 'Jurnal', icon: TrendingUp },
    { id: 'laporan', label: 'Laporan', icon: FileText },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Spacer</h2>
            <p className="text-sm text-gray-600">Sistem Akuntansi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="w-full flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
