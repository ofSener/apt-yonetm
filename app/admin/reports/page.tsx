'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  BarChart, 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Users, 
  Home, 
  CreditCard, 
  DollarSign,
  Share2
} from 'lucide-react';

// Rapor tipleri
const reportTypes = [
  { id: 'financial', name: 'Finansal Raporlar', icon: DollarSign },
  { id: 'payments', name: 'Ödeme Raporları', icon: CreditCard },
  { id: 'residents', name: 'Sakin Raporları', icon: Users },
  { id: 'maintenance', name: 'Bakım Raporları', icon: Home },
];

// Demo finansal veriler
const financialData = [
  { month: 'Ocak', income: 15000, expense: 8200 },
  { month: 'Şubat', income: 14500, expense: 7800 },
  { month: 'Mart', income: 15200, expense: 9100 },
  { month: 'Nisan', income: 14800, expense: 8500 },
  { month: 'Mayıs', income: 15100, expense: 8300 },
  { month: 'Haziran', income: 14900, expense: 8700 },
];

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const [selectedReport, setSelectedReport] = useState('financial');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 1 Ocak
    end: new Date().toISOString().split('T')[0], // Bugün
  });
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
        <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
      </div>
    );
  }
  
  const generateReport = async (format: 'pdf' | 'excel') => {
    setGeneratingReport(true);
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(false);
    
    // In a real app, you would download the file here
    alert(`${format.toUpperCase()} formatında rapor oluşturuldu.`);
  };
  
  // Calculate summary for the financial data
  const financialSummary = financialData.reduce((acc, item) => {
    acc.totalIncome += item.income;
    acc.totalExpense += item.expense;
    return acc;
  }, { totalIncome: 0, totalExpense: 0 });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
          <BarChart className="w-6 h-6 mr-2" />
          Raporlar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Apartman ile ilgili detaylı raporları görüntüleyin ve indirin.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rapor Türleri</h2>
            
            <div className="space-y-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      selectedReport === type.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-750'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {type.name}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filtreler</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Başlangıç Tarihi
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="start-date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="block w-full pl-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bitiş Tarihi
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="end-date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      className="block w-full pl-10 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <button
                    onClick={() => setLoading(true)}
                    disabled={loading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="mr-2">Yükleniyor</span>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      </>
                    ) : (
                      <>
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrele
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {reportTypes.find(r => r.id === selectedReport)?.name || 'Rapor'}
              </h2>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => generateReport('pdf')}
                  disabled={generatingReport}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </button>
                
                <button
                  onClick={() => generateReport('excel')}
                  disabled={generatingReport}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </button>
                
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Paylaş
                </button>
              </div>
            </div>
            
            {selectedReport === 'financial' && (
              <>
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-md p-3">
                        <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Toplam Gelir</h3>
                        <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {financialSummary.totalIncome.toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-100 dark:bg-red-800 rounded-md p-3">
                        <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Toplam Gider</h3>
                        <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">
                          {financialSummary.totalExpense.toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-md p-3">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Bakiye</h3>
                        <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                          {(financialSummary.totalIncome - financialSummary.totalExpense).toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Financial Data Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ay
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Gelir
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Gider
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Bakiye
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {financialData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/30'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.income.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.expense.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={`${
                              item.income - item.expense > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {(item.income - item.expense).toLocaleString('tr-TR')} ₺
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            
            {selectedReport === 'payments' && (
              <div className="text-center py-12">
                <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Ödeme Raporu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Seçilen tarih aralığındaki ödemeleri görüntüleyin. Filtrelerinizi düzenleyip "Filtrele" butonuna tıklayın.
                </p>
                <button
                  onClick={() => setLoading(true)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Raporu Oluştur
                </button>
              </div>
            )}
            
            {selectedReport === 'residents' && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Sakin Raporu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Apartmanınızdaki sakinlerin detaylı raporlarını görüntüleyin. Filtrelerinizi düzenleyip "Filtrele" butonuna tıklayın.
                </p>
                <button
                  onClick={() => setLoading(true)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Raporu Oluştur
                </button>
              </div>
            )}
            
            {selectedReport === 'maintenance' && (
              <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Bakım Raporu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Apartmanınızdaki bakım ve onarım işlemlerinin raporlarını görüntüleyin. Filtrelerinizi düzenleyip "Filtrele" butonuna tıklayın.
                </p>
                <button
                  onClick={() => setLoading(true)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Raporu Oluştur
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 