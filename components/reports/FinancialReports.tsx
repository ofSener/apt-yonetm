"use client";

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { LuDownload, LuFilter, LuCalendar, LuArrowRight } from 'react-icons/lu';

// Örnek veri - gerçek uygulamada API'den gelecek
const generateMockData = () => {
  // Aylar
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  // Aidat gelirleri
  const duesData = months.map((month, index) => {
    const baseAmount = 15000 + Math.random() * 3000;
    const collectedAmount = baseAmount * (0.7 + Math.random() * 0.25);
    return {
      name: month,
      beklenen: Math.round(baseAmount),
      tahsilEdilen: Math.round(collectedAmount),
      oran: Math.round((collectedAmount / baseAmount) * 100),
    };
  });
  
  // Gider kategorileri
  const expenseCategories = [
    { name: 'Elektrik', value: 4500 },
    { name: 'Su', value: 3200 },
    { name: 'Temizlik', value: 2800 },
    { name: 'Bakım', value: 3500 },
    { name: 'Personel', value: 5200 },
    { name: 'Sigorta', value: 1800 },
    { name: 'Diğer', value: 1500 },
  ];
  
  // Aylık giderler
  const monthlyExpenses = months.map((month, index) => {
    return {
      name: month,
      tutar: 15000 + Math.round(Math.random() * 5000),
    };
  });
  
  // Bütçe Takibi
  const budgetData = months.map((month, index) => {
    const budget = 20000;
    const expense = 15000 + Math.round(Math.random() * 8000);
    return {
      name: month,
      butce: budget,
      gider: expense,
      kalan: budget - expense,
    };
  });
  
  return {
    duesData,
    expenseCategories,
    monthlyExpenses,
    budgetData
  };
};

// Renk paleti
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FECB4F'];

// Tarih formatı
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

interface FinancialReportsProps {
  apartmentId: string;
}

export default function FinancialReports({ apartmentId }: FinancialReportsProps) {
  const [reportType, setReportType] = useState<'income' | 'expense' | 'budget' | 'summary'>('summary');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('year');
  const [data, setData] = useState(() => generateMockData());
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date()
  });

  // Report başlığı
  const getReportTitle = () => {
    switch (reportType) {
      case 'income': return 'Aidat Gelirleri Raporu';
      case 'expense': return 'Gider Analizi Raporu';
      case 'budget': return 'Bütçe Takip Raporu';
      case 'summary': return 'Finansal Özet Raporu';
      default: return 'Finansal Rapor';
    }
  };

  // Filtreleme - gerçek uygulamada API'ye istek atılacak
  const filterData = () => {
    setIsLoading(true);
    
    // Gerçek uygulamada burada API çağrısı yapılır
    // Şimdilik veriyi yeniden oluşturalım
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 800);
  };

  // Örnek PDF indirme
  const handleDownloadPDF = () => {
    alert('PDF indirme fonksiyonu. Gerçek uygulamada PDF raporu oluşturulacak.');
  };

  // Örnek Excel indirme
  const handleDownloadExcel = () => {
    alert('Excel indirme fonksiyonu. Gerçek uygulamada Excel dosyası oluşturulacak.');
  };

  // Report içeriği
  const renderReportContent = () => {
    switch (reportType) {
      case 'income':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Aidat Tahsilat Oranları</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.duesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'oran') return [`${value}%`, 'Tahsilat Oranı'];
                      return [Number(value).toLocaleString('tr-TR') + ' ₺', name === 'beklenen' ? 'Beklenen' : 'Tahsil Edilen'];
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="beklenen" name="Beklenen" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="tahsilEdilen" name="Tahsil Edilen" fill="#82ca9d" />
                    <Line yAxisId="right" dataKey="oran" name="Tahsilat Oranı (%)" stroke="#ff7300" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Toplam Beklenen</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {data.duesData.reduce((sum, item) => sum + item.beklenen, 0).toLocaleString('tr-TR')} ₺
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Toplam Tahsilat</h3>
                <p className="text-3xl font-bold text-green-600">
                  {data.duesData.reduce((sum, item) => sum + item.tahsilEdilen, 0).toLocaleString('tr-TR')} ₺
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Ortalama Tahsilat Oranı</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.round(data.duesData.reduce((sum, item) => sum + item.oran, 0) / data.duesData.length)}%
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'expense':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Gider Kategorileri</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.expenseCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toLocaleString('tr-TR') + ' ₺'} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Aylık Giderler</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.monthlyExpenses}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => value.toLocaleString('tr-TR')} />
                    <Tooltip formatter={(value) => value.toLocaleString('tr-TR') + ' ₺'} />
                    <Area type="monotone" dataKey="tutar" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Gider Detayları</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tutar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Oran</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.expenseCategories.map((category, index) => {
                      const total = data.expenseCategories.reduce((sum, item) => sum + item.value, 0);
                      const percentage = ((category.value / total) * 100).toFixed(1);
                      
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{category.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{category.value.toLocaleString('tr-TR')} ₺</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'budget':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Bütçe ve Gider Takibi</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.budgetData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => value.toLocaleString('tr-TR')} />
                    <Tooltip formatter={(value) => value.toLocaleString('tr-TR') + ' ₺'} />
                    <Legend />
                    <Bar dataKey="butce" name="Bütçe" fill="#8884d8" />
                    <Bar dataKey="gider" name="Gider" fill="#82ca9d" />
                    <Bar dataKey="kalan" name="Kalan" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Toplam Bütçe</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {data.budgetData.reduce((sum, item) => sum + item.butce, 0).toLocaleString('tr-TR')} ₺
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Toplam Gider</h3>
                <p className="text-3xl font-bold text-green-600">
                  {data.budgetData.reduce((sum, item) => sum + item.gider, 0).toLocaleString('tr-TR')} ₺
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Kalan Bütçe</h3>
                <p className="text-3xl font-bold text-amber-600">
                  {data.budgetData.reduce((sum, item) => sum + item.kalan, 0).toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'summary':
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Toplam Gelir</h3>
                <p className="text-3xl font-bold text-green-600">
                  {data.duesData.reduce((sum, item) => sum + item.tahsilEdilen, 0).toLocaleString('tr-TR')} ₺
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Beklenen: {data.duesData.reduce((sum, item) => sum + item.beklenen, 0).toLocaleString('tr-TR')} ₺</span>
                  <button 
                    onClick={() => setReportType('income')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    Detay <LuArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Toplam Gider</h3>
                <p className="text-3xl font-bold text-red-600">
                  {data.expenseCategories.reduce((sum, item) => sum + item.value, 0).toLocaleString('tr-TR')} ₺
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">En yüksek: {data.expenseCategories[0].name}</span>
                  <button 
                    onClick={() => setReportType('expense')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    Detay <LuArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Genel Durum</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {(data.duesData.reduce((sum, item) => sum + item.tahsilEdilen, 0) - 
                    data.expenseCategories.reduce((sum, item) => sum + item.value, 0)).toLocaleString('tr-TR')} ₺
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Bütçe Kullanımı: %82</span>
                  <button 
                    onClick={() => setReportType('budget')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    Detay <LuArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aidat Tahsilatları</h3>
                  <button 
                    onClick={() => setReportType('income')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    Detay <LuArrowRight className="ml-1" />
                  </button>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.duesData.slice(-6)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => value.toLocaleString('tr-TR')} />
                      <Tooltip formatter={(value) => value.toLocaleString('tr-TR') + ' ₺'} />
                      <Legend />
                      <Line type="monotone" dataKey="beklenen" name="Beklenen" stroke="#8884d8" />
                      <Line type="monotone" dataKey="tahsilEdilen" name="Tahsil Edilen" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gider Kategorileri</h3>
                  <button 
                    onClick={() => setReportType('expense')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                  >
                    Detay <LuArrowRight className="ml-1" />
                  </button>
                </div>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.expenseCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {data.expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString('tr-TR') + ' ₺'} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{getReportTitle()}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-3 py-1 text-sm rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
          >
            <LuDownload className="mr-1" /> PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className="flex items-center px-3 py-1 text-sm rounded-md bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
          >
            <LuDownload className="mr-1" /> Excel
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rapor Türü
            </label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            >
              <option value="summary">Genel Özet</option>
              <option value="income">Aidat Gelirleri</option>
              <option value="expense">Gider Analizi</option>
              <option value="budget">Bütçe Takibi</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zaman Aralığı
            </label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
            >
              <option value="month">Son Ay</option>
              <option value="quarter">Son 3 Ay</option>
              <option value="year">Son 12 Ay</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              &nbsp;
            </label>
            <button
              onClick={filterData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Yükleniyor...' : 'Filtrele'}
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : renderReportContent()}
    </div>
  );
} 