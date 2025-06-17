
import React, { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, DollarSign, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';

const Laporan: React.FC = () => {
  const { getFinancialSummary } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('bulan-ini');
  const summary = getFinancialSummary();

  const laporanData = {
    labaRugi: {
      pendapatan: summary.totalRevenue,
      bebanOperasional: Math.floor(summary.totalRevenue * 0.4),
      bebanLain: Math.floor(summary.totalRevenue * 0.1),
      labaKotor: summary.totalRevenue - Math.floor(summary.totalRevenue * 0.4),
      labaBersih: summary.netIncome
    },
    neraca: {
      asetLancar: summary.totalRevenue * 0.6,
      asetTetap: summary.totalRevenue * 1.5,
      totalAset: summary.totalRevenue * 2.1,
      kewajibanJangkaPendek: summary.totalRevenue * 0.3,
      kewajibanJangkaPanjang: summary.totalRevenue * 0.7,
      totalKewajiban: summary.totalRevenue * 1.0,
      modal: summary.totalRevenue * 1.1
    },
    arusKas: {
      arusKasOperasi: summary.totalRevenue * 0.8,
      arusKasInvestasi: -summary.totalRevenue * 0.2,
      arusKasPendanaan: summary.totalRevenue * 0.1,
      kasAwal: summary.totalRevenue * 0.3,
      kasAkhir: summary.totalRevenue * 0.4
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${Math.floor(amount).toLocaleString('id-ID')}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-3 h-8 w-8" />
              Laporan Keuangan
            </h1>
            <p className="text-gray-600 mt-2">Laporan sesuai Standar Akuntansi Indonesia</p>
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
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(laporanData.labaRugi.pendapatan)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Beban</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(laporanData.labaRugi.bebanOperasional + laporanData.labaRugi.bebanLain)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Laba Bersih</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(laporanData.labaRugi.labaBersih)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Laporan Laba Rugi */}
        <Card>
          <CardHeader>
            <CardTitle>Laporan Laba Rugi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3">PENDAPATAN</h3>
                <div className="flex justify-between">
                  <span>Penjualan Barang/Jasa</span>
                  <span className="font-medium">{formatCurrency(laporanData.labaRugi.pendapatan)}</span>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3">BEBAN</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Beban Operasional</span>
                    <span className="font-medium">{formatCurrency(laporanData.labaRugi.bebanOperasional)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beban Lain-lain</span>
                    <span className="font-medium">{formatCurrency(laporanData.labaRugi.bebanLain)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Beban</span>
                    <span>{formatCurrency(laporanData.labaRugi.bebanOperasional + laporanData.labaRugi.bebanLain)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>LABA BERSIH</span>
                  <span className="text-blue-600">{formatCurrency(laporanData.labaRugi.labaBersih)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neraca */}
        <Card>
          <CardHeader>
            <CardTitle>Neraca (Laporan Posisi Keuangan)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3">ASET</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Aset Lancar</span>
                    <span className="font-medium">{formatCurrency(laporanData.neraca.asetLancar)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aset Tetap</span>
                    <span className="font-medium">{formatCurrency(laporanData.neraca.asetTetap)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Aset</span>
                    <span>{formatCurrency(laporanData.neraca.totalAset)}</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3">KEWAJIBAN</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kewajiban Jangka Pendek</span>
                    <span className="font-medium">{formatCurrency(laporanData.neraca.kewajibanJangkaPendek)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kewajiban Jangka Panjang</span>
                    <span className="font-medium">{formatCurrency(laporanData.neraca.kewajibanJangkaPanjang)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Kewajiban</span>
                    <span>{formatCurrency(laporanData.neraca.totalKewajiban)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>MODAL</span>
                  <span className="text-green-600">{formatCurrency(laporanData.neraca.modal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Laporan Arus Kas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Laporan Arus Kas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Arus Kas Operasi</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Penerimaan dari Pelanggan</span>
                    <span className="font-medium text-green-600">+{formatCurrency(laporanData.arusKas.arusKasOperasi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pembayaran Operasional</span>
                    <span className="font-medium text-red-600">-{formatCurrency(laporanData.labaRugi.bebanOperasional * 0.3)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Arus Kas Operasi</span>
                    <span className="text-green-600">{formatCurrency(laporanData.arusKas.arusKasOperasi)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Arus Kas Investasi</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pembelian Peralatan</span>
                    <span className="font-medium text-red-600">{formatCurrency(laporanData.arusKas.arusKasInvestasi)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Arus Kas Investasi</span>
                    <span className="text-red-600">{formatCurrency(laporanData.arusKas.arusKasInvestasi)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Arus Kas Pendanaan</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Modal/Pinjaman</span>
                    <span className="font-medium text-green-600">+{formatCurrency(laporanData.arusKas.arusKasPendanaan)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Arus Kas Pendanaan</span>
                    <span className="text-green-600">{formatCurrency(laporanData.arusKas.arusKasPendanaan)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Kas Awal Periode</span>
                <span className="font-medium">{formatCurrency(laporanData.arusKas.kasAwal)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">Kenaikan (Penurunan) Kas</span>
                <span className="font-medium text-green-600">+{formatCurrency(laporanData.arusKas.kasAkhir - laporanData.arusKas.kasAwal)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-lg font-bold border-t pt-2">
                <span>Kas Akhir Periode</span>
                <span className="text-blue-600">{formatCurrency(laporanData.arusKas.kasAkhir)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Laporan;
