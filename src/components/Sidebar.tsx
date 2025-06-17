
import React from 'react';
import { 
  Home, 
  Receipt, 
  Package, 
  FileText, 
  TrendingUp, 
  Calculator,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'kasir', label: 'Kasir', icon: Calculator },
  { id: 'transaksi', label: 'Transaksi', icon: Receipt },
  { id: 'produk', label: 'Produk', icon: Package },
  { id: 'laporan', label: 'Laporan', icon: FileText },
  { id: 'jurnal', label: 'Jurnal', icon: TrendingUp },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400">SiAkuntansi</h1>
        <p className="text-sm text-slate-400 mt-1">Sistem Akuntansi Indonesia</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors duration-200",
                    activeSection === item.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <button className="w-full text-left p-3 rounded-lg flex items-center space-x-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};
